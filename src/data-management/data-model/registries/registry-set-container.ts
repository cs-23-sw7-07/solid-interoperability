import { Prefixes, Store } from "n3";
import { createTriple, newResourceContainer, Rdf } from "../RDF/rdf";
import { Fetch } from "../../../fetch";
import { INTEROP } from "../namespace";
import { SocialAgentProfileDocument } from "../profile-documents";
import { createContainer } from "../../Utils/modify-pod";
import { IRandom } from "../../../random/IRandom";

export class RegistrySetResource extends Rdf {
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

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
