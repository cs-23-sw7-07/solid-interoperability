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
  /**
   * Creates an instance of the SocialAgentRegistration class.
   * @param id - The ID of the social agent registration.
   * @param fetch - The fetch function used for making HTTP requests.
   * @param dataset - The dataset used for storing data.
   * @param prefixes - The prefixes used for resolving URIs.
   */
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  /**
   * Creates a new instance of SocialAgentRegistration.
   * 
   * @param id - The ID of the registration.
   * @param fetch - The fetch function used for making HTTP requests.
   * @param registeredBy - The social agent who performed the registration.
   * @param registeredWith - The application agent with which the registration is associated.
   * @param registeredAgent - The social agent being registered.
   * @param hasAccessGrant - An array of access grants associated with the registration.
   * @param reciprocalRegistration - The ID of the reciprocal registration, if any.
   * @returns A promise that resolves to a new instance of SocialAgentRegistration.
   */
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
      triple("registeredAgent", registeredAgent.getWebID()),
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

  /**
   * Gets the registered agent.
   * @returns The registered agent.
   * @throws {SAIViolationMissingTripleError} If the webId is missing.
   */
  get RegisteredAgent(): SocialAgent {
    const webId = this.getObjectValueFromPredicate(INTEROP + "registeredAgent");
    if (!webId)
      throw new SAIViolationMissingTripleError(this, "registeredAgent");

    return new SocialAgent(webId);
  }

  /**
   * Gets the reciprocal registration value.
   * @returns The reciprocal registration value.
   * @throws {SAIViolationMissingTripleError} If the reciprocal registration value is missing.
   */
  get ReciprocalRegistration(): string {
    const reciprocalRegistration = this.getObjectValueFromPredicate(
      INTEROP + "reciprocalRegistration",
    )!;
    if (!reciprocalRegistration)
      throw new SAIViolationMissingTripleError(this, "registeredAgent");

    return reciprocalRegistration;
  }
}
