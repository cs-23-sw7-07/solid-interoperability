import N3, { Prefixes, Store } from "n3";
import { Rdf, createTriple, newResourceContainer } from "../RDF/rdf";
import { Fetch } from "../../../fetch";
import { INTEROP, TYPE_A } from "../namespace";
import { SocialAgentProfileDocument } from "../profile-documents/social-agent-profile-document";
import {
  createContainer,
  updateContainerResource,
} from "../../Utils/modify-pod";

const { DataFactory } = N3;
const { namedNode } = DataFactory;

export class RegistrySetResource extends Rdf {
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  static async createRegistriesSet(
    fetch: Fetch,
    pod: string,
    profileDocument: SocialAgentProfileDocument,
  ) {
    const registriesContainer = pod + "Registries/";
    const agentRegistryContainer = registriesContainer + "agentregistries/";
    const authorizationRegistryContainer =
      registriesContainer + "accessregistries/";
    const dataRegistryContainer = pod + "data/";

    await createContainer(fetch, registriesContainer);
    await createContainer(fetch, agentRegistryContainer);
    await createContainer(fetch, authorizationRegistryContainer);
    await createContainer(fetch, dataRegistryContainer);

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
    await profileDocument.addHasRegistrySet(set);
    return set;
  }

  get HasAgentRegistry(): string | undefined {
    return this.getObjectValueFromPredicate(INTEROP + "hasAgentRegistry");
  }

  get HasAuthorizationRegistry(): string | undefined {
    return this.getObjectValueFromPredicate(
      INTEROP + "hasAuthorizationRegistry",
    );
  }

  get HasDataRegistry(): string | undefined {
    return this.getObjectValueFromPredicate(INTEROP + "hasDataRegistry");
  }
}
