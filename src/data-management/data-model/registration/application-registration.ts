import {Prefixes, Store} from "n3";
import {ApplicationAgent, SocialAgent} from "../agent";
import {AgentRegistration} from "./agent-registration";
import {AccessGrant} from "../authorization/access";
import {Fetch} from "../../../fetch";
import {createTriple, newResourceContainer} from "../RDF/rdf";
import {INTEROP} from "../namespace";
import {SAIViolationMissingTripleError} from "../../../Errors";

/**
 * A class which has the fields to conform to the `Application Agent Registration` graph defined in the Solid interoperability specification.
 * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#application-registration
 */
export class ApplicationRegistration extends AgentRegistration {
  /**
   * Creates an instance of ApplicationRegistration.
   * @param id - The ID of the application registration.
   * @param fetch - The fetch function used for making HTTP requests.
   * @param dataset - The dataset used for storing application data.
   * @param prefixes - The prefixes used for in the RDF.
   */
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  /**
   * Creates a new instance of ApplicationRegistration.
   * 
   * @param id - The ID of the registration.
   * @param fetch - The fetch function used for making HTTP requests.
   * @param registeredBy - The social agent who registered the application.
   * @param registeredWith - The application agent which registered the application.
   * @param registeredAgent - The application agent that represents the registered application.
   * @param hasAccessGrant - An array of access grants associated with the registration.
   * @returns A new instance of ApplicationRegistration.
   */
  static async new(
    id: string,
    fetch: Fetch,
    registeredBy: SocialAgent,
    registeredWith: ApplicationAgent,
    registeredAgent: ApplicationAgent,
    hasAccessGrant: AccessGrant[],
  ) {
    const triple = (predicate: string, object: string | Date) =>
      createTriple(id, INTEROP + predicate, object);

    const quads = super.newQuadsAgent(
      id,
      registeredBy,
      registeredWith,
      new Date(),
      new Date(),
      hasAccessGrant,
    );
    quads.push(triple("registeredAgent", registeredAgent.getWebID()));

    return newResourceContainer(
      ApplicationRegistration,
      fetch,
      id,
      "ApplicationRegistration",
      quads,
    );
  }

  /**
   * Gets the registered agent for the application.
   * @returns {ApplicationAgent} The registered agent.
   * @throws {SAIViolationMissingTripleError} If the registered agent webId is missing.
   */
  get RegisteredAgent(): ApplicationAgent {
    const webId = this.getObjectValueFromPredicate(INTEROP + "registeredAgent");
    if (!webId)
      throw new SAIViolationMissingTripleError(this, "registeredAgent");

    return new ApplicationAgent(webId);
  }

  async setRegisteredAgent(agent: ApplicationAgent) {
    const predicate = INTEROP + "registeredAgent";
    const quad = this.createTriple(predicate, agent.getWebID());
    await this.update(predicate, [quad]);
  }
}
