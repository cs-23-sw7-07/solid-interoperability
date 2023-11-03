import N3 from "n3"
import { ItoRdf } from "../factory/ItoRdf";
import { Agent, ApplicationAgent, SocialAgent } from "../agent";
import { AccessGrant } from "../authorization/access-grant";

const { DataFactory } = N3;
const { namedNode, literal } = DataFactory;

export abstract class AgentRegistration implements ItoRdf {
    id: string;
    registeredBy : SocialAgent;
    registeredWith : ApplicationAgent;
    registeredAt : Date;
    updatedAt : Date;
    registeredAgent : Agent;
    hasAccessGrant : AccessGrant;
    
    constructor(id: string, registeredBy: SocialAgent, registeredWith: ApplicationAgent, registeredAt : Date, updatedAt : Date, registeredAgent: Agent, hasAccessGrant: AccessGrant) {
        this.id = id;
        this.registeredBy = registeredBy;
        this.registeredWith = registeredWith;
        this.registeredAt = registeredAt;
        this.updatedAt = updatedAt;
        this.registeredAgent = registeredAgent;
        this.hasAccessGrant = hasAccessGrant;
    }

    public toRdf(writer: N3.Writer) {
        const subjectNode = namedNode(`${this.registeredBy.identity}/agents/${this.id}/`)

        writer.addQuad(
            subjectNode,
            namedNode('interop:registeredBy'),
            namedNode(this.registeredBy.getWebID())
        );
        writer.addQuad(
            subjectNode,
            namedNode('interop:registeredWith'),
            namedNode(this.registeredWith.getWebID())
        );
        writer.addQuad(
            subjectNode,
            namedNode('interop:registeredAt'),
            literal(this.registeredAt.toISOString(), namedNode("xsd:dateTime"))
        );
        writer.addQuad(
            subjectNode,
            namedNode('interop:updatedAt'),
            literal(this.updatedAt.toISOString(), namedNode("xsd:dateTime"))
        );
        writer.addQuad(
            subjectNode,
            namedNode('interop:registeredAgent'),
            namedNode(this.registeredAgent.getWebID())
        );
        writer.addQuad(
            subjectNode,
            namedNode('interop:hasAccessGrant'),
            namedNode(`${this.registeredBy.identity}/agents/${this.id}/` + this.hasAccessGrant.id)
        );
    }
}
