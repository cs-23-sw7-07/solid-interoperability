import { Prefixes, Store } from "n3";
import { Agent, ApplicationAgent, SocialAgent } from "../../agent";
import { Rdf, createTriple } from "../../RDF/rdf";
import { NotImplementedYet } from "../../../../Errors/NotImplementedYet";
import { Fetch } from "../../../../fetch";
import { INTEROP } from "../../namespace";

export abstract class Access extends Rdf {
  /**
   * A class which has the fields to conform to the `Access Authorization` graph defined in the Solid interoperability specification.
   * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#access-authorization
   */
  constructor(
    id: string,
    type: string,
    fetch: Fetch, 
    dataset?: Store,
    prefixes?: Prefixes,
  ) {
    super(id, type, fetch, dataset, prefixes);
  }

  static newQuadsAccess(
    id: string,
    grantedBy: SocialAgent,
    grantedAt: Date,
    grantee: Agent,
    hasAccessNeedGroup: string) {
    const triple = (predicate: string, object: string | Date) => createTriple(id, INTEROP + predicate, object);
    const quads = [
      triple("grantedBy", grantedBy.webID),
      triple("grantedAt", grantedAt),
      triple("grantee", grantee.webID),
      triple("hasAccessNeedGroup", hasAccessNeedGroup)
    ]
    return quads;
  }

  get GrantedBy(): SocialAgent {
    throw new NotImplementedYet();
  }

  get GrantedWith(): ApplicationAgent {
    throw new NotImplementedYet();
  }

  get GrantedAt(): Date {
    throw new NotImplementedYet();
  }

  get Grantee(): Agent {
    throw new NotImplementedYet();
  }

  get HasAccessNeedGroup(): string {
    throw new NotImplementedYet();
  }
}
