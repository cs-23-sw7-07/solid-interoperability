import {Prefixes, Store} from "n3";
import {getResources, Rdf} from "../RDF/rdf";
import {Fetch} from "../../../fetch";
import {INTEROP} from "../namespace";
import {AgentRegistration} from "../registration/agent-registration";
import {ApplicationRegistration} from "../registration/application-registration";
import {SocialAgentRegistration} from "../registration/social-agent-registration";

export class AgentRegistryResource extends Rdf {
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  getHasSocialAgentRegistration(): Promise<SocialAgentRegistration[]> {
    return getResources(
      SocialAgentRegistration,
      this.fetch,
      this.getObjectValuesFromPredicate(
        INTEROP + "hasSocialAgentRegistration",
      ) ?? [],
    );
  }

  getHasApplicationRegistration(): Promise<ApplicationRegistration[]> {
    return getResources(
      ApplicationRegistration,
      this.fetch,
      this.getObjectValuesFromPredicate(
        INTEROP + "hasApplicationRegistration",
      ) ?? [],
    );
  }

  async addRegistration(registration: AgentRegistration) {
    const predicate =
      registration instanceof ApplicationRegistration
        ? INTEROP + "hasApplicationRegistration"
        : INTEROP + "hasSocialAgentRegistration";
    const quad = this.createTriple(predicate, registration.uri);
    await this.add([quad]);
  }
}
