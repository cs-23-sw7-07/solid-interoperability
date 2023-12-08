import {Agent, SocialAgent} from "../../agent";
import {createTriple, getResource, Rdf} from "../../RDF/rdf";
import {INTEROP} from "../../namespace";
import {getDate} from "../../../Utils";
import {SAIViolationMissingTripleError} from "../../../../Errors";
import {AccessNeedGroup} from "../access-needs/access-need-group";
import {getAgent} from "../../../Utils/get-grantee";

/**
 * Represents an abstract class for access authorization and grant.
 */
export abstract class Access extends Rdf {
  /**
   * Creates an array of quads representing the access.
   * @param id - The identifier of the access.
   * @param grantedBy - The social agent who granted the access.
   * @param grantedAt - The date when the access was granted.
   * @param grantee - The agent who was granted the access.
   * @param hasAccessNeedGroup - The access need group associated with the access.
   * @returns An array of quads representing the access.
   */
  static newQuadsAccess(
    id: string,
    grantedBy: SocialAgent,
    grantedAt: Date,
    grantee: Agent,
    hasAccessNeedGroup: AccessNeedGroup,
  ) {
    const triple = (predicate: string, object: string | Date) =>
      createTriple(id, INTEROP + predicate, object);
    return [
      triple("grantedBy", grantedBy.getWebID()),
      triple("grantedAt", grantedAt),
      triple("grantee", grantee.getWebID()),
      triple("hasAccessNeedGroup", hasAccessNeedGroup.uri),
    ];
  }

  /**
   * Gets the social agent who granted the access.
   * @returns The social agent who granted the access.
   * @throws SAIViolationMissingTripleError if the triple is missing.
   */
  get GrantedBy(): SocialAgent {
    const grantedBy = this.getObjectValueFromPredicate(INTEROP + "grantedBy");
    if (grantedBy) return new SocialAgent(grantedBy);
    throw new SAIViolationMissingTripleError(this, INTEROP + "grantedBy");
  }

  /**
   * Gets the date when the access was granted.
   * @returns The date when the access was granted.
   * @throws SAIViolationMissingTripleError if the triple is missing.
   */
  get GrantedAt(): Date {
    const grantedAt = this.getObjectValueFromPredicate(INTEROP + "grantedAt");
    if (grantedAt) return getDate(grantedAt);
    throw new SAIViolationMissingTripleError(this, INTEROP + "grantedAt");
  }

  /**
   * Gets the grantee associated with the access.
   * @returns A promise that resolves to the grantee agent.
   */
  getGrantee(): Promise<Agent> {
    return getAgent(this, this.fetch, "grantee");
  }

  /**
   * Gets the access need group associated with the access.
   * @returns A promise that resolves to the access need group.
   * @throws SAIViolationMissingTripleError if the triple is missing.
   */
  public async getHasAccessNeedGroup(): Promise<AccessNeedGroup> {
    const uri = this.getObjectValueFromPredicate(
      INTEROP + "hasAccessNeedGroup",
    );
    if (uri) return await getResource(AccessNeedGroup, this.fetch, uri);
    throw new SAIViolationMissingTripleError(
      this,
      INTEROP + "hasAccessNeedGroup",
    );
  }
}
