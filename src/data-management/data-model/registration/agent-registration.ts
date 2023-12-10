import { Prefixes, Quad, Store } from "n3";
import { ApplicationAgent, SocialAgent } from "../agent";
import { AccessGrant } from "../authorization/access";
import { Registration } from "./registration";
import { INTEROP } from "../namespace";
import { createTriple, getResources } from "../RDF/rdf";
import { SAIViolationMissingTripleError } from "../../../Errors";
import { Fetch } from "../../../fetch";

/**
 * An abstract class which is used polymorphic where functions which both a `Social Agent Registration` or `Application Agent Registration` can perform.
 * Has the fields which both the agent types share.
 */
export abstract class AgentRegistration extends Registration {
  protected constructor(
    id: string,
    fetch: Fetch,
    dataset?: Store,
    prefixes?: Prefixes,
  ) {
    super(id, fetch, dataset, prefixes);
  }
  /**
   * Creates new quads for an agent registration.
   * @param id - The ID of the agent registration.
   * @param registeredBy - The social agent who registered the agent.
   * @param registeredWith - The application agent with which the agent is registered.
   * @param registeredAt - The date when the agent was registered.
   * @param updatedAt - The date when the agent registration was last updated.
   * @param hasAccessGrant - An array of access grants associated with the agent registration.
   * @returns An array of quads representing the agent registration.
   */
  protected static newQuadsAgent(
    id: string,
    registeredBy: SocialAgent,
    registeredWith: ApplicationAgent,
    registeredAt: Date,
    updatedAt: Date,
    hasAccessGrant: AccessGrant[],
  ): Quad[] {
    const triple = (predicate: string, object: string | Date) =>
      createTriple(id, INTEROP + predicate, object);
    const quads = super.newQuadsReg(
      id,
      registeredBy,
      registeredWith,
      registeredAt,
      updatedAt,
    );

    for (const grant of hasAccessGrant) {
      quads.push(triple("hasAccessGrant", grant.uri));
    }
    return quads;
  }

  /**
   * Retrieves the access grants associated with the agent registration.
   * @returns A promise that resolves to an array of AccessGrant objects.
   * @throws {SAIViolationMissingTripleError} If the 'hasAccessGrant' predicate is missing.
   */
  async getHasAccessGrants(): Promise<AccessGrant[]> {
    const grantIRIs = this.getObjectValuesFromPredicate(
      INTEROP + "hasAccessGrant",
    );
    if (!grantIRIs)
      throw new SAIViolationMissingTripleError(this, "hasAccessGrant");

    return getResources(AccessGrant, this.fetch, grantIRIs);
  }

  /**
   * Adds an access grant to the agent registration.
   *
   * @param grant The access grant to be added.
   */
  async AddAccessGrant(grant: AccessGrant) {
    const predicate = INTEROP + "hasAccessGrant";
    const quad = this.createTriple(predicate, grant.uri);
    await this.add([quad]);
    await this.updateDate();
  }
}
