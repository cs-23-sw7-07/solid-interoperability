import {Prefixes, Store} from "n3";
import {Rdf} from "../RDF/rdf";
import {Fetch} from "../../../fetch";
import {INTEROP} from "../namespace";
import {AgentRegistration} from "../agent-registration/agent-registration";
import {ApplicationRegistration} from "../agent-registration/application-registration";


export class AgentRegistryResource extends Rdf {
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

    get HasSocialAgentRegistration(): string[] | undefined {
        return this.getObjectValuesFromPredicate(INTEROP + "hasSocialAgentRegistration");
    }

    get HasApplicationRegistration(): string[] | undefined {
        return this.getObjectValuesFromPredicate(INTEROP + "hasApplicationRegistration");
    }

    async addRegistration(registration: AgentRegistration) {
        const predicate =
        registration instanceof ApplicationRegistration
                ? INTEROP + "hasApplicationRegistration"
                : INTEROP + "hasSocialAgentRegistration";
        const quad = this.createTriple(predicate, registration.uri)
        await this.add([quad])
    }

    get HasDataRegistry(): string | undefined {
        return this.getObjectValueFromPredicate(INTEROP + "hasDataRegistry");
    }
}
