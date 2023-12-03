import { Prefixes, Store } from "n3";
import { Agent, SocialAgent } from "../../agent";
import { DataRegistration } from "../../data-registration/data-registration";
import { GrantScope } from "../grant-scope";
import { Fetch } from "../../../../fetch";
import { AccessMode } from "../access/access-mode";
import { Data } from "./data";
import { createTriple, getResource } from "../../RDF/rdf";
import { INTEROP } from "../../namespace";
import { getScopeOfAuth } from "../../../Utils";
import { AccessNeed } from "../access-needs/access-need";
import { SAIViolationError, SAIViolationMissingTripleError } from "../../../../Errors";
import { IDataGrantBuilder } from "./IDataGrantBuilder";
import { DataGrant } from "./data-grant";

export class DataAuthorization extends Data {
  /**
   * A class which has the fields to conform to the `Data Authorization` graph defined in the Solid interoperability specification.
   * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#data-authorization
   */
  constructor(
    id: string,
    fetch: Fetch, 
    dataset?: Store,
    prefixes?: Prefixes,
  ) {
    super(id, fetch, dataset, prefixes);
  }

  static new(
    id: string,
    fetch: Fetch,
    grantee: Agent,
    registeredShapeTree: string,
    satisfiesAccessNeed: AccessNeed,
    accessMode: AccessMode[],
    scopeOfAuthorization: GrantScope,
    creatorAccessMode?: AccessMode[],
    dataOwner?: SocialAgent,
    hasDataRegistration?: DataRegistration,
    hasDataInstance?: string[],
    inheritsFromAuthorization?: DataAuthorization,
  ) {
    const triple = (predicate: string, object: string | Date) => createTriple(id, INTEROP + predicate, object);
    const quads = super.newQuads(id, grantee, registeredShapeTree, satisfiesAccessNeed, accessMode, creatorAccessMode);

    quads.push(triple("scopeOfAuthorization", scopeOfAuthorization))

    if (dataOwner)
      quads.push(triple("dataOwner", dataOwner.webID))

    if (hasDataRegistration)
      quads.push(triple("hasDataRegistration", hasDataRegistration.uri));

    if (hasDataInstance) {
      for (const iri of hasDataInstance) {
        quads.push(triple("hasDataInstanceIRI", iri))
      }
    }

    if (inheritsFromAuthorization) {
      quads.push(triple("inheritsFromAuthorization", inheritsFromAuthorization.uri))
    }

    return new DataAuthorization(id, fetch, new Store(quads));
  }

  public get DataOwner(): SocialAgent {
    const dataOwner = this.getObjectValueFromPredicate(INTEROP + "dataOwner");
    if (dataOwner) {
      return new SocialAgent(dataOwner);
    }
    else if (this.ScopeOfAuthorization != GrantScope.All)
      throw new SAIViolationMissingTripleError(this, INTEROP + "dataOwner");
    throw new SAIViolationError(this, "Since the scope of authorization is " + this.ScopeOfAuthorization + " it has no data owner property.");
  }

  public async getHasDataRegistration(): Promise<DataRegistration> {
    const iri = this.getObjectValueFromPredicate(INTEROP + "hasDataRegistration");
    if (iri) {
      return await getResource(DataRegistration, this.fetch, iri);
    }
    else {
      const scope = this.ScopeOfAuthorization;
      if (scope == GrantScope.AllFromRegistry || scope == GrantScope.SelectedFromRegistry || scope == GrantScope.Inherited)
        throw new SAIViolationMissingTripleError(this, INTEROP + "hasDataRegistration");
    }
    throw new SAIViolationError(this, "Since the scope of authorization is " + this.ScopeOfAuthorization + " it has no data registration attacted.");
  }

  public get ScopeOfAuthorization(): GrantScope {
    const scope = this.getObjectValueFromPredicate(INTEROP + "scopeOfAuthorization");
    if (scope)
      return getScopeOfAuth(scope);
    throw new SAIViolationMissingTripleError(this, INTEROP + "scopeOfAuthorization");
  }

  public get HasDataInstance(): string[] {
    const iris = this.getObjectValuesFromPredicate(INTEROP + "hasDataInstanceIRI");
    if (iris)
      return iris;
    else if (this.ScopeOfAuthorization == GrantScope.SelectedFromRegistry)
      throw new SAIViolationMissingTripleError(this, INTEROP + "hasDataInstanceIRI");
    throw new SAIViolationError(this, "Since the scope of authorization is " + this.ScopeOfAuthorization + " it has no data instance attacted.");
  }

  public async getInheritsFromAuthorization(): Promise<DataAuthorization> {
    const iri = this.getObjectValueFromPredicate(INTEROP + "inheritsFromAuthorization");
    if (iri) {
      return await getResource(DataAuthorization, this.fetch, iri);
    }
    else if (this.ScopeOfAuthorization == GrantScope.Inherited)
      throw new SAIViolationMissingTripleError(this, INTEROP + "inheritsFromAuthorization");
    throw new SAIViolationError(this, "Since the scope of authorization is " + this.ScopeOfAuthorization + " it has no inherited authorization attacted.");
  }


  async toDataGrant(builder: IDataGrantBuilder): Promise<DataGrant[]> {
    const grants: DataGrant[] = [];

    switch (this.ScopeOfAuthorization) {
      case GrantScope.All:
      case GrantScope.AllFromAgent: {
        for (const reg of await builder.getAllDataRegistrations(
          this.RegisteredShapeTree,
          this.DataOwner,
        )) {
          grants.push(
            DataGrant.new(
              builder.generateId(),
              this.fetch,
              this.Grantee,
              this.RegisteredShapeTree,
              await this.getSatisfiesAccessNeed(),
              this.AccessMode,
              GrantScope.AllFromRegistry,
              reg.RegisteredBy,
              reg,
              this.CreatorAccessMode,
            ),
          );
        }
        break;
      }
      case GrantScope.AllFromRegistry: {
        const reg = await this.getHasDataRegistration();
        grants.push(
          DataGrant.new(
            builder.generateId(),
            this.fetch,
            this.Grantee,
            this.RegisteredShapeTree,
            await this.getSatisfiesAccessNeed(),
            this.AccessMode,
            GrantScope.AllFromRegistry,
            reg.RegisteredBy,
            reg,
            this.CreatorAccessMode,
          ),
        );
        break;
      }
      case GrantScope.SelectedFromRegistry: {
        const reg = await this.getHasDataRegistration();
        grants.push(
          DataGrant.new(
            builder.generateId(),
            this.fetch,
            this.Grantee,
            this.RegisteredShapeTree,
            await this.getSatisfiesAccessNeed(),
            this.AccessMode,
            GrantScope.AllFromRegistry,
            reg.RegisteredBy,
            reg,
            this.CreatorAccessMode,
            this.HasDataInstance,
          ),
        );
        break;
      }
      case GrantScope.Inherited: {
        const reg = await this.getHasDataRegistration();
        for (const inheritedGrant of await builder.getInheritedDataGrants(
          this,
        )) {
          grants.push(
            DataGrant.new(
              builder.generateId(),
              this.fetch,
              this.Grantee,
              this.RegisteredShapeTree,
              await this.getSatisfiesAccessNeed(),
              this.AccessMode,
              GrantScope.AllFromRegistry,
              reg.RegisteredBy,
              reg,
              this.CreatorAccessMode,
              undefined,
              inheritedGrant
            ),
          );
        }
        break;
      }
      default:
        throw new SAIViolationError(this, this.ScopeOfAuthorization + " is not a valid scope of authorization");
    }
    return grants;
  }
}
