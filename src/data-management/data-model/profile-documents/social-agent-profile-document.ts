import N3, {Prefixes, Store} from "n3";
import {INTEROP} from "../namespace";
import {getResource} from "../RDF/rdf";
import {Fetch} from "../../../fetch";
import {RegistrySetResource} from "../registries/registry-set-container";
import {serializeTurtle} from "../../turtle/turtle-serializer";
import {ProfileDocument} from "./profile-document";

const { quad, namedNode, defaultGraph } = N3.DataFactory;

const OIDC_ISSUER_PREDICATE = "http://www.w3.org/ns/solid/terms#oidcIssuer";

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
        return (
            authorizationAgents != undefined && authorizationAgents.includes(authorizationUri)
        );
    }

    async addHasAuthorizationAgent(agentUri: string, fetch: Fetch) {
        this.dataset.add(
            quad(
                this.SubjectWebId,
                namedNode(INTEROP + "hasAuthorizationAgent"),
                namedNode(agentUri),
                defaultGraph(),
            ),
        );
        await this.updateProfile(fetch);
    }

    get HasRegistrySet(): boolean {
        const sets = this.getObjectValuesFromPredicate(INTEROP + "hasRegistrySet");
        return sets != undefined;
    }

    getRegistrySet(): Promise<RegistrySetResource> {
        const set = this.getObjectValueFromPredicate(INTEROP + "hasRegistrySet")!;
        return getResource(RegistrySetResource, this.fetch, set);
    }

    async addHasRegistrySet(registriesContainer: string, fetch: Fetch) {
        this.dataset.add(
            quad(
                this.SubjectWebId,
                namedNode(INTEROP + "hasRegistrySet"),
                namedNode(registriesContainer),
                defaultGraph(),
            ),
        );
        await this.updateProfile(fetch);
    }

    private async updateProfile(fetch: Fetch) {
        await fetch(this.uri, {
            method: "PUT",
            body: await serializeTurtle(this.dataset, {
                interop: INTEROP,
            }),
            headers: {
                "Content-Type": "text/turtle",
            },
        });
    }

    get SubjectWebId() {
        for (const quad of this.dataset.match(null, namedNode(OIDC_ISSUER_PREDICATE))) {
            return quad.subject;
        }
        throw new Error("No subject with an OIDC Issuer");
    }
}
