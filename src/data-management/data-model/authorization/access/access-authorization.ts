import { Prefixes, Store } from "n3";
import { Agent, ApplicationAgent, SocialAgent } from "../../agent";
import { AccessGrant } from "./access-grant";
import { DataAuthorization, DataGrant } from "../data";
import { Fetch } from "../../../../fetch";
import { INTEROP } from "../../namespace";
import { Access } from "./access";
import {
  createTriple,
  getResource,
  getResources,
  newResource,
} from "../../RDF/rdf";
import { AccessNeedGroup } from "../access-needs";
import { SAIViolationMissingTripleError } from "../../../../Errors";

export class AccessAuthorization extends Access {
  /**
   * A class which has the fields to conform to the `Access Authorization` graph defined in the Solid interoperability specification.
   * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#access-authorization
   */
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  static async new(
    id: string,
    fetch: Fetch,
    grantedBy: SocialAgent,
    grantedWith: ApplicationAgent,
    grantedAt: Date,
    grantee: Agent,
    hasAccessNeedGroup: AccessNeedGroup,
    hasDataAuthorization: DataAuthorization[],
    replaces?: AccessAuthorization,
  ) {
    const triple = (predicate: string, object: string | Date) =>
      createTriple(id, INTEROP + predicate, object);
    const quads = super.newQuadsAccess(
      id,
      grantedBy,
      grantedAt,
      grantee,
      hasAccessNeedGroup,
    );

    quads.push(triple("grantedWith", grantedWith.getWebID()));

    for (const dataAuth of hasDataAuthorization) {
      quads.push(triple("hasDataAuthorization", dataAuth.uri));
    }
    if (replaces) {
      quads.push(triple("replaces", replaces.uri));
    }
    return newResource(
      AccessAuthorization,
      fetch,
      id,
      "AccessAuthorization",
      quads,
    );
  }

  public async toAccessGrant(id: string, data_grants: DataGrant[]) {
    return AccessGrant.new(
      id,
      this.fetch,
      this.GrantedBy,
      this.GrantedAt,
      await this.getGrantee(),
      await this.getHasAccessNeedGroup(),
      data_grants,
    );
  }

  get GrantedWith(): ApplicationAgent {
    const grantedWith = this.getObjectValueFromPredicate(
      INTEROP + "grantedWith",
    );
    if (grantedWith) return new ApplicationAgent(grantedWith);
    throw new SAIViolationMissingTripleError(this, INTEROP + "grantedWith");
  }

  async getHasDataAuthorization(): Promise<DataAuthorization[]> {
    const uris = this.getObjectValuesFromPredicate(
      INTEROP + "hasDataAuthorization",
    );
    if (uris) {
      return await getResources(DataAuthorization, this.fetch, uris);
    }
    throw new SAIViolationMissingTripleError(
      this,
      INTEROP + "hasDataAuthorization",
    );
  }

  async getReplaces(): Promise<AccessAuthorization | undefined> {
    const uri = this.getObjectValueFromPredicate(INTEROP + "replaces");
    if (uri) {
      return await getResource(AccessAuthorization, this.fetch, uri);
    }
    return undefined;
  }
}
