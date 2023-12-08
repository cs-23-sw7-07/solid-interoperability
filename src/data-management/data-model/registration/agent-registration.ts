import { Prefixes, Quad, Store } from "n3";
import { ApplicationAgent, SocialAgent } from "../agent";
import { AccessGrant } from "../authorization/access";
import { Registration } from "./registration";
import { Fetch } from "../../../fetch";
import { INTEROP } from "../namespace";
import { createTriple, getResources } from "../RDF/rdf";
import { SAIViolationMissingTripleError } from "../../../Errors";

export abstract class AgentRegistration extends Registration {
  /**
   * An abstract class which is used polymorphic where functions which both a `Social Agent Registration` or `Application Agent Registration` can perform.
   * Has the fields which both the agent types share.
   */
  protected constructor(
    id: string,
    fetch: Fetch,
    dataset?: Store,
    prefixes?: Prefixes,
  ) {
    super(id, fetch, dataset, prefixes);
  }

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

  async getHasAccessGrants(): Promise<AccessGrant[]> {
    const grantIRIs = this.getObjectValuesFromPredicate(
      INTEROP + "hasAccessGrant",
    );
    if (!grantIRIs)
      throw new SAIViolationMissingTripleError(this, "hasAccessGrant");

    return getResources(AccessGrant, this.fetch, grantIRIs);
  }

  async AddAccessGrant(value: AccessGrant) {
    const predicate = INTEROP + "hasAccessGrant";
    const quad = this.createTriple(predicate, value.uri);
    await this.add([quad]);
    await this.updateDate();
  }
}
