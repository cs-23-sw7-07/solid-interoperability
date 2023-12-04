import {Prefixes, Store} from "n3";
import {Agent, ApplicationAgent, SocialAgent} from "../../agent";
import {createTriple, getResource, Rdf} from "../../RDF/rdf";
import {Fetch} from "../../../../fetch";
import {INTEROP} from "../../namespace";
import {getDate} from "../../../Utils";
import { SAIViolationMissingTripleError } from "../../../../Errors";
import { AccessNeedGroup } from "../access-needs/access-need-group";

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
    hasAccessNeedGroup: AccessNeedGroup) {
    const triple = (predicate: string, object: string | Date) => createTriple(id, INTEROP + predicate, object);
    return [
      triple("grantedBy", grantedBy.webID),
      triple("grantedAt", grantedAt),
      triple("grantee", grantee.webID),
      triple("hasAccessNeedGroup", hasAccessNeedGroup.uri)
    ];
  }

  get GrantedBy(): SocialAgent {
    const grantedBy = this.getObjectValueFromPredicate(INTEROP + "grantedBy");
    if (grantedBy)
      return new SocialAgent(grantedBy)
    throw new SAIViolationMissingTripleError(this, INTEROP + "grantedBy")
  }

  get GrantedAt(): Date {
    const grantedAt = this.getObjectValueFromPredicate(INTEROP + "grantedAt");
    if (grantedAt)
      return getDate(grantedAt)
    throw new SAIViolationMissingTripleError(this, INTEROP + "grantedAt")
  }

  get Grantee(): Agent {
    const grantee = this.getObjectValueFromPredicate(INTEROP + "grantee");
    if (grantee)
      return new ApplicationAgent(grantee)
    throw new SAIViolationMissingTripleError(this, INTEROP + "grantee")
  }

  public async getHasAccessNeedGroup(): Promise<AccessNeedGroup> {
    const uri = this.getObjectValueFromPredicate(INTEROP + "hasAccessNeedGroup");
    if (uri)
      return await getResource(AccessNeedGroup, this.fetch, uri)
    throw new SAIViolationMissingTripleError(this, INTEROP + "hasAccessNeedGroup")
  }
}
