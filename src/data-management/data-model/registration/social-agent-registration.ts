import {Prefixes, Store} from "n3";
import {AgentRegistration} from "./agent-registration";
import {Fetch} from "../../../fetch";
import {INTEROP} from "../namespace";
import {ApplicationAgent, SocialAgent} from "../agent";
import {AccessGrant} from "../authorization/access";
import {SAIViolationMissingTripleError} from "../../../Errors";
import {createTriple, newResourceContainer} from "../RDF/rdf";

/**
 * A class which has the fields to conform to the `Social Agent Registration` graph defined in the Solid interoperability specification.
 * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#social-agent-registration
 */
export class SocialAgentRegistration extends AgentRegistration {
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  static async new(
    id: string,
    fetch: Fetch,
    registeredBy: SocialAgent,
    registeredWith: ApplicationAgent,
    registeredAgent: SocialAgent,
    hasAccessGrant: AccessGrant[],
    reciprocalRegistration: string,
  ) {
    const triple = (predicate: string, object: string) =>
      createTriple(id, INTEROP + predicate, object);

    const quads = super.newQuadsAgent(
      id,
      registeredBy,
      registeredWith,
      new Date(),
      new Date(),
      hasAccessGrant,
    );
    quads.push(
      triple("registeredAgent", registeredAgent.webID),
      triple("reciprocalRegistration", reciprocalRegistration),
    );

    return newResourceContainer(
      SocialAgentRegistration,
      fetch,
      id,
      "SocialAgentRegistration",
      quads,
    );
  }

  get RegisteredAgent(): SocialAgent {
    const webId = this.getObjectValueFromPredicate(INTEROP + "registeredAgent");
    if (!webId)
      throw new SAIViolationMissingTripleError(this, "registeredAgent");

    return new SocialAgent(webId);
  }

  get ReciprocalRegistration(): string {
    const reciprocalRegistration = this.getObjectValueFromPredicate(
      INTEROP + "reciprocalRegistration",
    )!;
    if (!reciprocalRegistration)
      throw new SAIViolationMissingTripleError(this, "registeredAgent");

    return reciprocalRegistration;
  }
}
