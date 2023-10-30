import N3 from "n3"
import { ItoRdf } from "../factory/ItoRdf";
import { AccessGrant } from "../access-authorization/access-grant";
import { Agent, ApplicationAgent, SocialAgent } from "../agent";

const { DataFactory } = N3;
const { namedNode, literal, quad } = DataFactory;

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
        const subject = `${this.registeredBy.identity}/agents/${this.id}/`

        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:registeredBy'),
            namedNode(this.registeredBy.getWebID())
        ));
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:registeredWith'),
            namedNode(this.registeredWith.getWebID())
        ));
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:registeredAt'),
            literal(this.registeredAt.toISOString(), namedNode("xsd:dateTime"))
        ));
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:updatedAt'),
            literal(this.updatedAt.toISOString(), namedNode("xsd:dateTime"))
        ));
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:registeredAgent'),
            namedNode(this.registeredAgent.getWebID())
        ));
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:hasAccessGrant'),
            namedNode(subject + this.hasAccessGrant.id)
        ));
    }
}
