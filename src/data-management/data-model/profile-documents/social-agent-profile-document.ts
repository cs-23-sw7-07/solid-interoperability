import N3, { Prefixes, Store } from "n3";
import { INTEROP } from "../namespace";
import { getResource } from "../RDF/rdf";
import { Fetch } from "../../../fetch";
import { RegistrySetResource } from "../registries";
import { ProfileDocument } from "./profile-document";
import { SAIViolationError } from "../../../Errors";
import {URL} from "url";

/**
 * Represents a Social Agent Profile Document.
 * Extends the base ProfileDocument class.
 */
export class SocialAgentProfileDocument extends ProfileDocument {
  /**
   * Constructs a new instance of the SocialAgentProfileDocument class.
   * @param id - The ID of the profile document.
   * @param fetch - The Fetch function used for HTTP requests.
   * @param dataset - The dataset to store the profile document data.
   * @param prefixes - The prefixes used for RDF serialization.
   */
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  /**
   * Checks if the profile document has an authorization agent with the specified URI.
   * @param authorizationUri - The URI of the authorization agent.
   * @returns True if the profile document has the authorization agent, false otherwise.
   */
  hasAuthorizationAgent(authorizationUri: string): boolean {
    const authorizationAgents = this.getObjectValuesFromPredicate(
      INTEROP + "hasAuthorizationAgent",
    );
    return (
      authorizationAgents != undefined &&
      authorizationAgents.includes(authorizationUri)
    );
  }

  /**
   * Adds an authorization agent to the profile document.
   * @param agentUri - The URI of the authorization agent to add.
   */
  async addHasAuthorizationAgent(agentUri: string) {
    await this.add([
      this.createTriple(INTEROP + "hasAuthorizationAgent", agentUri),
    ]);
  }

  /**
   * Checks if the profile document has a registry set.
   * @returns True if the profile document has a registry set, false otherwise.
   */
  get HasRegistrySet(): boolean {
    const sets = this.getObjectValuesFromPredicate(INTEROP + "hasRegistrySet");
    return sets != undefined;
  }

  /**
   * Retrieves the registry set associated with the profile document.
   * @returns A Promise that resolves to the RegistrySetResource.
   * @throws {SAIViolationError} if no registry set is found.
   */
  getRegistrySet(): Promise<RegistrySetResource> {
    const set = this.getObjectValueFromPredicate(INTEROP + "hasRegistrySet");
    if (set == undefined) {
      throw new SAIViolationError(this, "No registry set found");
    }
    return getResource(RegistrySetResource, this.fetch, set);
  }

  /**
   * Adds a registry set to the profile document.
   * @param registriesContainer - The RegistrySetResource to add as the registry set.
   * @throws {SAIViolationMissingTripleError} if the profile document already has a registry set.
   */
  async addHasRegistrySet(registriesContainer: RegistrySetResource) {
    const set = this.getObjectValueFromPredicate(INTEROP + "hasRegistrySet");
    if (set)
      throw new SAIViolationError(
        this,
        "The Social Agent has already a registry set.",
      );
    await this.add([
      this.createTriple(INTEROP + "hasRegistrySet", registriesContainer.uri),
    ]);
  }
}
