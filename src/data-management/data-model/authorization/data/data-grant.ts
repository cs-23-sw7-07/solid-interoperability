import { Prefixes, Store } from "n3";
import { Agent, SocialAgent } from "../../agent";
import { DataRegistration } from "../../registration/data-registration";
import { GrantScope } from "../grant-scope";
import { AccessMode } from "../access/access-mode";
import { createTriple, getResource, newResource } from "../../RDF/rdf";
import { Fetch } from "../../../../fetch";
import { Data } from "./data";
import { INTEROP } from "../../namespace";
import { getScopeOfAuth, scopeOfAuthFromEnum } from "../../../Utils";
import { AccessNeed } from "../access-needs/access-need";
import {
  SAIViolationError,
  SAIViolationMissingTripleError,
} from "../../../../Errors";

export class DataGrant extends Data {
  /**
   * A class which has the fields to conform to the `Data Grant` graph defined in the Solid interoperability specification.
   * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#data-grant
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
    scopeOfGrant: GrantScope,
    dataOwner: SocialAgent,
    hasDataRegistration: DataRegistration,
    creatorAccessMode?: AccessMode[],
    hasDataInstance?: string[],
    InheritsFromGrant?: DataGrant,
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

    quads.push(triple("scopeOfGrant", scopeOfAuthFromEnum(scopeOfGrant)));
    quads.push(triple("dataOwner", dataOwner.getWebID()));
    quads.push(triple("hasDataRegistration", hasDataRegistration.uri));

    if (hasDataInstance) {
      for (const iri of hasDataInstance) {
        quads.push(triple("hasDataInstance", iri));
      }
    }

    if (InheritsFromGrant) {
      quads.push(triple("inheritsFromAuthorization", InheritsFromGrant.uri));
    }

    return newResource(DataGrant, fetch, id, "DataGrant", quads);
  }

  public get DataOwner(): SocialAgent {
    const dataOwner = this.getObjectValueFromPredicate(INTEROP + "dataOwner");
    if (dataOwner) {
      return new SocialAgent(dataOwner);
    }
    throw new SAIViolationError(
      this,
      "Since the scope of grant is " +
        this.ScopeOfGrant +
        " it has no data owner property.",
    );
  }

  public async getHasDataRegistration(): Promise<DataRegistration> {
    const iri = this.getObjectValueFromPredicate(
      INTEROP + "hasDataRegistration",
    );
    if (iri) {
      return await getResource(DataRegistration, this.fetch, iri);
    }
    throw new SAIViolationMissingTripleError(
      this,
      INTEROP + "hasDataRegistration",
    );
  }

  public get ScopeOfGrant(): GrantScope {
    const scope = this.getObjectValueFromPredicate(INTEROP + "scopeOfGrant");
    if (scope) return getScopeOfAuth(scope);
    throw new SAIViolationMissingTripleError(this, INTEROP + "scopeOfGrant");
  }

  public get HasDataInstance(): string[] {
    if (this.ScopeOfGrant != GrantScope.SelectedFromRegistry)
      throw new SAIViolationError(
        this,
        "Since the scope of grant is " +
          this.ScopeOfGrant +
          " it has no data instance attached.",
      );
    const iris = this.getObjectValuesFromPredicate(INTEROP + "hasDataInstance");
    if (iris) return iris;
    throw new SAIViolationMissingTripleError(this, INTEROP + "hasDataInstance");
  }

  public async getInheritsFromGrant(): Promise<DataGrant> {
    if (this.ScopeOfGrant != GrantScope.Inherited)
      throw new SAIViolationError(
        this,
        "Since the scope of grant is " +
          this.ScopeOfGrant +
          " it has no inherited grant attached.",
      );
    const iri = this.getObjectValueFromPredicate(INTEROP + "inheritsFromGrant");
    if (iri) {
      return await getResource(DataGrant, this.fetch, iri);
    }
    throw new SAIViolationMissingTripleError(
      this,
      INTEROP + "inheritsFromAuthorization",
    );
  }
}
