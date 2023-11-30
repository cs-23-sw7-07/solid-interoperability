import N3, { Prefixes, Store } from "n3";
import { DatasetCore } from "@rdfjs/types";
import { Agent, ApplicationAgent, SocialAgent } from "../../agent";
import { ItoRdf } from "../../factory/ItoRdf";
import { Rdf } from "../../RDF/rdf";
import { AccessGrant } from "./access-grant";
import { DataGrant } from "../data/data-grant";
import { DataAuthorization } from "../data/data-authorization";
import { NotImplementedYet } from "../../../../Errors/NotImplementedYet";
import { Fetch } from "../../../../fetch";
import { INTEROP } from "../../namespace";
import { Access } from "./access";

const { DataFactory } = N3;
const { namedNode, literal } = DataFactory;

export class AccessAuthorization extends Access {
  /**
   * A class which has the fields to conform to the `Access Authorization` graph defined in the Solid interoperability specification.
   * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#access-authorization
   */
  constructor(
    id: string,
    fetch: Fetch, 
    dataset?: Store,
    prefixes?: Prefixes,
  ) {
    super(id, "AccessAuthorization", fetch, dataset, prefixes);
  }

  static async new(
    id: string,
    grantedBy: SocialAgent,
    grantedWith: ApplicationAgent,
    grantedAt: Date,
    grantee: Agent,
    hasAccessNeedGroup: string, //Needs to Access Need Group class
    hasDataAuthorization: DataAuthorization[],
    replaces?: AccessAuthorization,) {
    const auth = new AccessAuthorization(id, fetch)
    const triple = (predicate: string, object: string | Date) => auth.createTriple(INTEROP + predicate, object);
    const quads = super.newQuadsAccess(id, grantedBy, grantedAt, grantee, hasAccessNeedGroup);
    quads.push(triple("grantedWith", grantedWith.webID))
    for (const dataAuth of hasDataAuthorization) {
      quads.push(triple("hasDataAuthorization", dataAuth.uri))
    }
    if (replaces) {
      quads.push(triple("replaces", replaces.uri))
    }
    return auth;
  }

  toAccessGrant(id: string, data_grants: DataGrant[]) {
    return AccessGrant.new(
      id,
      this.GrantedBy,
      this.GrantedAt,
      this.Grantee,
      this.HasAccessNeedGroup,
      data_grants,
    );
  }


  get GrantedWith(): ApplicationAgent {
    throw new NotImplementedYet();
  }

  get HasDataAuthorization(): DataAuthorization[] {
    throw new NotImplementedYet();
  }

  get Replaces(): AccessAuthorization | undefined {
    throw new NotImplementedYet();
  }
}
