import {Prefixes, Store} from "n3";
import {Agent, ApplicationAgent, SocialAgent} from "../../agent";
import {createTriple, Rdf} from "../../RDF/rdf";
import {Fetch} from "../../../../fetch";
import {INTEROP} from "../../namespace";
import {getDate} from "../../../Utils";

export abstract class Access extends Rdf {
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
    super(id, fetch, dataset, prefixes);
  }

  static newQuadsAccess(
    id: string,
    grantedBy: SocialAgent,
    grantedAt: Date,
    grantee: Agent,
    hasAccessNeedGroup: string) {
    const triple = (predicate: string, object: string | Date) => createTriple(id, INTEROP + predicate, object);
    return [
      triple("grantedBy", grantedBy.webID),
      triple("grantedAt", grantedAt),
      triple("grantee", grantee.webID),
      triple("hasAccessNeedGroup", hasAccessNeedGroup)
    ];
  }

  get GrantedBy(): SocialAgent {
    return new SocialAgent(this.getObjectValueFromPredicate("grantedBy")!)
  }

  get GrantedWith(): ApplicationAgent {
    return new ApplicationAgent(this.getObjectValueFromPredicate("grantedWith")!)
  }

  get GrantedAt(): Date {
    return getDate(this.getObjectValueFromPredicate("grantedAt")!)
  }

  get Grantee(): Agent {
    return new ApplicationAgent(this.getObjectValueFromPredicate("grantee")!)
  }

  get HasAccessNeedGroup(): string {
    return this.getObjectValueFromPredicate("hasAccessNeedGroup")!
  }
}
