import N3, {Prefixes, Store} from "n3";
import {Rdf} from "../RDF/rdf";
import {Fetch} from "../../../fetch";
import {INTEROP, TYPE_A} from "../namespace";
import {SocialAgentProfileDocument} from "../profile-documents/social-agent-profile-document";
import {createContainer, updateContainerResource} from "../../Utils/modify-pod";

const { DataFactory } = N3;
const { namedNode } = DataFactory;

export class RegistrySetResource extends Rdf {
    constructor(
        id: string,
        fetch: Fetch, 
        dataset?: Store,
        prefixes?: Prefixes,
      ) {
        super(
          id,
          fetch, dataset, prefixes
        );
      }

    get HasAgentRegistry(): string | undefined {
        return this.getObjectValueFromPredicate(INTEROP + "hasAgentRegistry");
    }

    get HasAuthorizationRegistry(): string | undefined {
        return this.getObjectValueFromPredicate(INTEROP + "hasAuthorizationRegistry");
    }

    get HasDataRegistry(): string | undefined {
        return this.getObjectValueFromPredicate(INTEROP + "hasDataRegistry");
    }
}

export async function createRegistriesSet(
    fetch: Fetch,
    pod: string,
    profileDocument: SocialAgentProfileDocument,
) {
    const registriesContainer = pod + "Registries/";
    const agentRegistryContainer = registriesContainer + "agentregistries/";
    const authorizationRegistryContainer = registriesContainer + "accessregistries/";
    const dataRegistryContainer = pod + "data/";

    await createContainer(fetch, registriesContainer);
    await createContainer(fetch, agentRegistryContainer);
    await createContainer(fetch, authorizationRegistryContainer);
    await createContainer(fetch, dataRegistryContainer);

    const registriesStore = new Store();
    registriesStore.addQuad(
        namedNode(registriesContainer),
        namedNode(TYPE_A),
        namedNode(INTEROP + "RegistrySet"),
    );
    registriesStore.addQuad(
        namedNode(registriesContainer),
        namedNode(INTEROP + "hasAgentRegistry"),
        namedNode(agentRegistryContainer),
    );
    registriesStore.addQuad(
        namedNode(registriesContainer),
        namedNode(INTEROP + "hasAuthorizationRegistry"),
        namedNode(authorizationRegistryContainer),
    );
    registriesStore.addQuad(
        namedNode(registriesContainer),
        namedNode(INTEROP + "hasDataRegistry"),
        namedNode(dataRegistryContainer),
    );

    await updateContainerResource(fetch, registriesContainer, registriesStore).then((_) =>
        profileDocument.addHasRegistrySet(registriesContainer, fetch),
    );

    return new RegistrySetResource(registriesContainer, fetch, registriesStore, {});
}
