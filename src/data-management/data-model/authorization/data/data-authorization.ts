import { Prefixes, Store } from "n3";
import { Agent, SocialAgent } from "../../agent";
import { DataRegistration } from "../../data-registration/data-registration";
import { GrantScope } from "../grant-scope";
import { Fetch } from "../../../../fetch";
import { AccessMode } from "../access/access-mode";
import { Data } from "./data";
import { createTriple, getResource, newResource } from "../../RDF/rdf";
import { INTEROP } from "../../namespace";
import { getScopeOfAuth, scopeOfAuthFromEnum } from "../../../Utils";
import { AccessNeed } from "../access-needs/access-need";
import {
  SAIViolationError,
  SAIViolationMissingTripleError,
} from "../../../../Errors";
import { IDataGrantBuilder } from "./IDataGrantBuilder";
import { DataGrant } from "./data-grant";

export class DataAuthorization extends Data {
  /**
   * A class which has the fields to conform to the `Data Authorization` graph defined in the Solid interoperability specification.
   * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#data-authorization
   */
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
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
    const triple = (predicate: string, object: string | Date) =>
      createTriple(id, INTEROP + predicate, object);
    const quads = super.newQuads(
      id,
      grantee,
      registeredShapeTree,
      satisfiesAccessNeed,
      accessMode,
      creatorAccessMode,
    );

    quads.push(
      triple("scopeOfAuthorization", scopeOfAuthFromEnum(scopeOfAuthorization)),
    );

    if (dataOwner) quads.push(triple("dataOwner", dataOwner.webID));

    if (hasDataRegistration)
      quads.push(triple("hasDataRegistration", hasDataRegistration.uri));

    if (hasDataInstance) {
      for (const iri of hasDataInstance) {
        quads.push(triple("hasDataInstanceIRI", iri));
      }
    }

    if (inheritsFromAuthorization) {
      quads.push(
        triple("inheritsFromAuthorization", inheritsFromAuthorization.uri),
      );
    }

    return newResource(
      DataAuthorization,
      fetch,
      id,
      "DataAuthorization",
      quads,
    );
  }

  public get ScopeOfAuthorization(): GrantScope {
    const scope = this.getObjectValueFromPredicate(
      { predicate: INTEROP + "scopeOfAuthorization" },
    );
    if (scope) return getScopeOfAuth(scope);
    throw new SAIViolationMissingTripleError(
      this,
      INTEROP + "scopeOfAuthorization",
    );
  }

  public get DataOwner(): SocialAgent {
    if (this.ScopeOfAuthorization == GrantScope.All)
      throw new SAIViolationError(
        this,
        "Since the scope of authorization is " +
          this.ScopeOfAuthorization +
          " it has no data owner property.",
      );
    const dataOwner = this.getObjectValueFromPredicate({ predicate: INTEROP + "dataOwner" });
    if (dataOwner) {
      return new SocialAgent(dataOwner);
    }
    throw new SAIViolationMissingTripleError(this, INTEROP + "dataOwner");
  }

  public async getHasDataRegistration(): Promise<DataRegistration> {
    const scope = this.ScopeOfAuthorization;
    if (scope == GrantScope.All || scope == GrantScope.AllFromAgent)
      throw new SAIViolationError(
        this,
        "Since the scope of authorization is " +
          this.ScopeOfAuthorization +
          " it has no data registration attacted.",
      );
    const iri = this.getObjectValueFromPredicate(
      { predicate: INTEROP + "hasDataRegistration" },
    );
    if (iri) {
      return await getResource(DataRegistration, this.fetch, iri);
    }
    throw new SAIViolationMissingTripleError(
      this,
      INTEROP + "hasDataRegistration",
    );
  }

  public get HasDataInstance(): string[] {
    if (this.ScopeOfAuthorization != GrantScope.SelectedFromRegistry)
      throw new SAIViolationError(
        this,
        "Since the scope of authorization is " +
          this.ScopeOfAuthorization +
          " it has no data instance attacted.",
      );
    const iris = this.getObjectValuesFromPredicate(INTEROP + "hasDataInstance");
    if (iris) return iris;
    throw new SAIViolationMissingTripleError(this, INTEROP + "hasDataInstance");
  }

  public async getInheritsFromAuthorization(): Promise<DataAuthorization> {
    if (this.ScopeOfAuthorization != GrantScope.Inherited)
      throw new SAIViolationError(
        this,
        "Since the scope of authorization is " +
          this.ScopeOfAuthorization +
          " it has no inherited authorization attacted.",
      );
    const iri = this.getObjectValueFromPredicate(
      { predicate: INTEROP + "inheritsFromAuthorization" },
    );
    if (iri) {
      return await getResource(DataAuthorization, this.fetch, iri);
    }
    throw new SAIViolationMissingTripleError(
      this,
      INTEROP + "inheritsFromAuthorization",
    );
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
            await DataGrant.new(
              builder.generateId(),
              this.fetch,
              await this.getGrantee(),
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
          await DataGrant.new(
            builder.generateId(),
            this.fetch,
            await this.getGrantee(),
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
          await DataGrant.new(
            builder.generateId(),
            this.fetch,
            await this.getGrantee(),
            this.RegisteredShapeTree,
            await this.getSatisfiesAccessNeed(),
            this.AccessMode,
            GrantScope.SelectedFromRegistry,
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
            await DataGrant.new(
              builder.generateId(),
              this.fetch,
              await this.getGrantee(),
              this.RegisteredShapeTree,
              await this.getSatisfiesAccessNeed(),
              this.AccessMode,
              GrantScope.Inherited,
              reg.RegisteredBy,
              reg,
              this.CreatorAccessMode,
              undefined,
              inheritedGrant,
            ),
          );
        }
        break;
      }
      default:
        throw new SAIViolationError(
          this,
          this.ScopeOfAuthorization + " is not a valid scope of authorization",
        );
    }
    return grants;
  }
}
