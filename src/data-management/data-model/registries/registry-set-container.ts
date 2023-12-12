import { Prefixes, Store } from "n3";
import {
  createTriple,
  getResource,
  newResourceContainer,
  Rdf,
} from "../RDF/rdf";
import { Fetch } from "../../../fetch";
import { INTEROP } from "../namespace";
import { SocialAgentProfileDocument } from "../profile-documents";
import { createContainer } from "../../Utils/modify-pod";
import { IRandom } from "../../../random/IRandom";
import { AgentRegistryResource } from "./agent-registry-container";
import { SAIViolationMissingTripleError } from "../../../Errors";
import { DataRegistryResource } from "./data-registry-container";
import { AuthorizationRegistryResource } from "./authorization-registry-container";

/**
 * Represents a registry set resource.
 */
export class RegistrySetResource extends Rdf {
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  /**
   * Creates a new registry set.
   * @param fetch - The fetch function used to make HTTP requests.
   * @param pod - The URL of the pod.
   * @param profileDocument - The social agent profile document.
   * @param randomgen - The random generator.
   * @returns The created registry set.
   */
  static async createRegistriesSet(
    fetch: Fetch,
    pod: string,
    profileDocument: SocialAgentProfileDocument,
    randomgen: IRandom,
  ) {
    const registriesContainer = pod + randomgen.randomID() + "/";
    const agentRegistryContainer =
      registriesContainer + randomgen.randomID() + "/";
    const authorizationRegistryContainer =
      registriesContainer + randomgen.randomID() + "/";
    const dataRegistryContainer = pod + randomgen.randomID() + "/";

    const triple = (predicate: string, object: string | Date) =>
      createTriple(registriesContainer, INTEROP + predicate, object);
    const quads = [];
    quads.push(triple("hasAgentRegistry", agentRegistryContainer));
    quads.push(
      triple("hasAuthorizationRegistry", authorizationRegistryContainer),
    );
    quads.push(triple("hasDataRegistry", dataRegistryContainer));

    const set = await newResourceContainer(
      RegistrySetResource,
      fetch,
      registriesContainer,
      "RegistrySet",
      quads,
    );

    await createContainer(fetch, agentRegistryContainer);
    await createContainer(fetch, authorizationRegistryContainer);
    await createContainer(fetch, dataRegistryContainer);

    await profileDocument.addHasRegistrySet(set);
    return set;
  }

  /**
   * Retrieves the AgentRegistryResource associated with this RegistrySetContainer.
   * @returns A Promise that resolves to the AgentRegistryResource.
   * @throws {SAIViolationMissingTripleError} If the AgentRegistryResource is not found.
   */
  async getHasAgentRegistry(): Promise<AgentRegistryResource> {
    const uri = this.getObjectValueFromPredicate(INTEROP + "hasAgentRegistry");
    if (uri) return getResource(AgentRegistryResource, this.fetch, uri);
    throw new SAIViolationMissingTripleError(
      this,
      INTEROP + "hasAgentRegistry",
    );
  }

  /**
   * Retrieves the authorization registry associated with this registry set.
   * @returns A Promise that resolves to the AuthorizationRegistryResource.
   * @throws {SAIViolationMissingTripleError} If the authorization registry is missing.
   */
  async getHasAuthorizationRegistry(): Promise<AuthorizationRegistryResource> {
    const uri = this.getObjectValueFromPredicate(
      INTEROP + "hasAuthorizationRegistry",
    );
    if (uri) return getResource(AuthorizationRegistryResource, this.fetch, uri);
    throw new SAIViolationMissingTripleError(
      this,
      INTEROP + "hasAuthorizationRegistry",
    );
  }

  /**
   * Retrieves the data registry associated with this registry set container.
   * @returns A promise that resolves to a DataRegistryResource object.
   * @throws {SAIViolationMissingTripleError} If the data registry URI is missing.
   */
  async getHasDataRegistry(): Promise<DataRegistryResource> {
    const uri = this.getObjectValueFromPredicate(INTEROP + "hasDataRegistry");
    if (uri) return getResource(DataRegistryResource, this.fetch, uri);
    throw new SAIViolationMissingTripleError(this, INTEROP + "hasDataRegistry");
  }
}
