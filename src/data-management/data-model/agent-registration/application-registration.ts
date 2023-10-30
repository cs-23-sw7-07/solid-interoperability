import N3 from "n3"
import { AccessGrant } from "../access-authorization/access-grant";
import { ApplicationAgent, SocialAgent } from "../agent";
import { AgentRegistration } from "./agent-registration";
import { ItoRdf } from "../factory/ItoRdf";

const { DataFactory } = N3;
const { namedNode, literal, quad } = DataFactory;

export class ApplicationRegistration extends AgentRegistration implements ItoRdf {
    constructor(
        id: string,
        registeredBy: SocialAgent,
        registeredWith: ApplicationAgent,
        registeredAt : Date,
        updatedAt : Date,
        registeredAgent: ApplicationAgent,
        hasAccessGrant: AccessGrant) {
        super(id, registeredBy, registeredWith, registeredAt, updatedAt, registeredAgent, hasAccessGrant);
    }

    public toRdf(writer: N3.Writer): void {
        const subject = `${this.registeredBy.identity}/agents/${this.id}/`

        writer.addQuad(
            namedNode(subject),
            namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
            namedNode('interop:ApplicationRegistration')
        );
        super.toRdf(writer)
    }
}