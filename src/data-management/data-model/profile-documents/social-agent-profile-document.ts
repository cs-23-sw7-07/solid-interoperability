import {Prefixes, Store} from "n3";
import {INTEROP} from "../namespace";
import {getResource} from "../RDF/rdf";
import {Fetch} from "../../../fetch";
import {RegistrySetResource} from "../registries/registry-set-container";
import {ProfileDocument} from "./profile-document";
import { SAIViolationError } from "../../../Errors";

export class SocialAgentProfileDocument extends ProfileDocument {
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

    hasAuthorizationAgent(authorizationUri: string): boolean {
        const authorizationAgents = this.getObjectValuesFromPredicate(
            INTEROP + "hasAuthorizationAgent",
        );
        return authorizationAgents != undefined && authorizationAgents.includes(authorizationUri);
    }

    async addHasAuthorizationAgent(agentUri: string) {
        await this.add(this.createTriple(INTEROP + "hasAuthorizationAgent", agentUri));
    }

    get HasRegistrySet(): boolean {
        const sets = this.getObjectValuesFromPredicate(INTEROP + "hasRegistrySet");
        return sets != undefined;
    }

    getRegistrySet(): Promise<RegistrySetResource> {
        const set = this.getObjectValueFromPredicate(INTEROP + "hasRegistrySet");
        if (set == undefined) {
            throw new Error("No registry set found");
        }
        return getResource(RegistrySetResource, this.fetch, set);
    }

    async addHasRegistrySet(registriesContainer: RegistrySetResource) {
        const set = this.getObjectValueFromPredicate(INTEROP + "hasRegistrySet");
        if (set)
            throw new SAIViolationError(this, "The Social Agent ahs already a registry set.");
        await this.add(this.createTriple(INTEROP + "hasRegistrySet", registriesContainer.uri));
    }
}
