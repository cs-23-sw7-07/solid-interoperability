import N3 from "n3"
import { ApplicationAgent, SocialAgent } from "../agent";
import { AgentRegistration } from "./agent-registration";
import { AccessGrant } from "../authorization/access-grant";

const { DataFactory } = N3;
const { namedNode, literal, quad } = DataFactory;

export class SocialAgentRegistration extends AgentRegistration {
    reciprocalRegistration: string;

    constructor(
        id: string,
        registeredBy: SocialAgent,
        registeredWith: ApplicationAgent,
        registeredAt: Date,
        updatedAt: Date,
        registeredAgent: SocialAgent,
        hasAccessGrant: AccessGrant,
        reciprocalRegistration: string) {
        super(id, registeredBy, registeredWith, registeredAt, updatedAt, registeredAgent, hasAccessGrant);
        this.reciprocalRegistration = reciprocalRegistration;
    }
        
    public toRdf(writer: N3.Writer): void {
        const subject = `${this.registeredBy.identity}/agents/${this.id}/`
        const subjectNode = namedNode(subject)

        writer.addQuad(
            subjectNode,
            namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
            namedNode('interop:SocialAgentRegistration')
        );
        super.toRdf(writer)
        writer.addQuad(
            subjectNode,
            namedNode('interop:reciprocalRegistration'),
            namedNode(this.reciprocalRegistration)
        );
    }
}