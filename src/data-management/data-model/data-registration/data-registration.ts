import N3 from 'n3';
import { Agent, SocialAgent } from "../agent";

const { DataFactory } = N3;
const { namedNode, literal, quad } = DataFactory;

export class DataRegistration {
    id: string;
    storedAtFolder: string;
    registeredBy: SocialAgent;
    registeredWith: Agent;
    registeredAt: Date;
    updatedAt: Date;
    registeredShapeTree: string;

    constructor(
        id: string,
        storedAtFolder: string,
        registeredBy: SocialAgent,
        registeredWith: Agent,
        registeredAt: Date,
        updatedAt: Date,
        registeredShapeTree: string
    ) {
        this.id = id;
        this.storedAtFolder = storedAtFolder;
        this.registeredBy = registeredBy;
        this.registeredWith = registeredWith;
        this.registeredAt = registeredAt;
        this.updatedAt = updatedAt;
        this.registeredShapeTree = registeredShapeTree;
    }

    toRdf(writer: N3.Writer): void {
        const subject = `${this.storedAtFolder}/${this.id}/`

        writer.addQuad(
            namedNode(subject),
            namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
            namedNode('interop:DataRegistration')
        );
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:registeredBy'),
            namedNode(this.registeredBy.getWebID()))
        );
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:registeredWith'),
            namedNode(this.registeredWith.getWebID()))
        );
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:registeredAt'),
            literal(this.registeredAt.toISOString(), namedNode("xsd:dateTime")))
        );
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:updatedAt'),
            literal(this.updatedAt.toISOString(), namedNode("xsd:dateTime")))
        );
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:registeredShapeTree'),
            namedNode(this.registeredShapeTree))
        );
    }
}