import { Prefixes, Store } from "n3";
import { Agent, SocialAgent } from "../../agent";
import { DataRegistration } from "../../data-registration/data-registration";
import { GrantScope } from "../grant-scope";
import { AccessMode } from "../access/access-mode";
import { createTriple, getResource } from "../../RDF/rdf";
import { Fetch } from "../../../../fetch";
import { Data } from "./data";
import { INTEROP } from "../../namespace";
import { getScopeOfAuth } from "../../../Utils";
import { AccessNeed } from "../access-needs/access-need";
import { SAIViolationError, SAIViolationMissingTripleError } from "../../../../Errors";

export class DataGrant extends Data{
  /**
   * A class which has the fields to conform to the `Data Grant` graph defined in the Solid interoperability specification.
   * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#data-grant
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
    scopeOfGrant: GrantScope,
    dataOwner: SocialAgent,
    hasDataRegistration: DataRegistration,
    creatorAccessMode?: AccessMode[],
    hasDataInstance?: string[],
    InheritsFromGrant?: DataGrant,
  ) {
    const triple = (predicate: string, object: string | Date) => createTriple(id, INTEROP + predicate, object);
    const quads = super.newQuads(id, grantee, registeredShapeTree, satisfiesAccessNeed, accessMode, creatorAccessMode);

    quads.push(triple("scopeOfGrant", scopeOfGrant))
    quads.push(triple("dataOwner", dataOwner.webID))
    quads.push(triple("hasDataRegistration", hasDataRegistration.uri));

    if (hasDataInstance) {
      for (const iri of hasDataInstance) {
        quads.push(triple("hasDataInstanceIRI", iri))
      }
    }

    if (InheritsFromGrant) {
      quads.push(triple("inheritsFromAuthorization", InheritsFromGrant.uri))
    }

    return new DataGrant(id, fetch, new Store(quads));
  }

  public get DataOwner(): SocialAgent {
    const dataOwner = this.getObjectValueFromPredicate("dataOwner");
    if (dataOwner) {
      return new SocialAgent(dataOwner);
    }
    throw new SAIViolationError(this, "Since the scope of authorization is " + this.ScopeOfGrant + " it has no data owner property.");
  }

  public async getHasDataRegistration(): Promise<DataRegistration> {
    const iri = this.getObjectValueFromPredicate(INTEROP + "hasDataRegistration");
    if (iri) {
      return await getResource(DataRegistration, this.fetch, iri);
    }
    throw new SAIViolationMissingTripleError(this, INTEROP + "hasDataRegistration");
  }

  public get ScopeOfGrant(): GrantScope {
    const scope = this.getObjectValueFromPredicate(INTEROP + "scopeOfGrant");
    if (scope)
      return getScopeOfAuth(scope);
    throw new SAIViolationMissingTripleError(this, INTEROP + "scopeOfGrant");
  }

  public get HasDataInstance(): string[] {
    const iris = this.getObjectValuesFromPredicate(INTEROP + "hasDataInstanceIRI");
    if (iris)
      return iris;
    else if (this.ScopeOfGrant == GrantScope.SelectedFromRegistry)
      throw new SAIViolationMissingTripleError(this, INTEROP + "hasDataInstanceIRI");
    throw new SAIViolationError(this, "Since the scope of authorization is " + this.ScopeOfGrant + " it has no data instance attacted.");
  }

  public async getInheritsFromGrant(): Promise<DataGrant> {
    const iri = this.getObjectValueFromPredicate(INTEROP + "inheritsFromAuthorization");
    if (iri) {
      return await getResource(DataGrant, this.fetch, iri);
    }
    else if (this.ScopeOfGrant == GrantScope.Inherited)
      throw new SAIViolationMissingTripleError(this, INTEROP + "inheritsFromAuthorization");
    throw new SAIViolationError(this, "Since the scope of authorization is " + this.ScopeOfGrant + " it has no inherited authorization attacted.");
  }
}

