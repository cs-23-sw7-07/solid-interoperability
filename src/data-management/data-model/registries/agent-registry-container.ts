import { Prefixes, Store } from "n3";
import { getResources, Rdf } from "../RDF/rdf";
import { Fetch } from "../../../fetch";
import { INTEROP } from "../namespace";
import { AgentRegistration } from "../registration/agent-registration";
import { ApplicationRegistration } from "../registration/application-registration";
import { SocialAgentRegistration } from "../registration/social-agent-registration";

/**
 * Represents a resource for managing agent registries.
 */
export class AgentRegistryResource extends Rdf {
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  /**
   * Retrieves the social agent registrations associated with this agent registry.
   * @returns A promise that resolves to an array of SocialAgentRegistration objects.
   */
  getHasSocialAgentRegistration(): Promise<SocialAgentRegistration[]> {
    return getResources(
      SocialAgentRegistration,
      this.fetch,
      this.getObjectValuesFromPredicate(
        INTEROP + "hasSocialAgentRegistration",
      ) ?? [],
    );
  }

  /**
   * Retrieves the application registrations associated with this agent registry.
   * @returns A promise that resolves to an array of ApplicationRegistration objects.
   */
  getHasApplicationRegistration(): Promise<ApplicationRegistration[]> {
    return getResources(
      ApplicationRegistration,
      this.fetch,
      this.getObjectValuesFromPredicate(
        INTEROP + "hasApplicationRegistration",
      ) ?? [],
    );
  }

  /**
   * Adds a registration to the agent registry.
   * @param registration - The registration to be added.
   */
  async addRegistration(registration: AgentRegistration) {
    const predicate =
      registration instanceof ApplicationRegistration
        ? INTEROP + "hasApplicationRegistration"
        : INTEROP + "hasSocialAgentRegistration";
    const quad = this.createTriple(predicate, registration.uri);
    await this.add([quad]);
  }
}
