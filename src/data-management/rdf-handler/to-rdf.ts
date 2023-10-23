import N3 from 'n3';
const { DataFactory } = N3;
const { namedNode, literal, defaultGraph, quad } = DataFactory;

import { ApplicationtRegistration } from "../data-model/agent-registration/application-registration";
import { SocialAgentRegistration } from '../data-model/agent-registration/social-agent-registration';

const prefixes = {
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    xsd: 'http://www.w3.org/2001/XMLSchema#',
    acl: 'http://www.w3.org/ns/auth/acl#',
    interop: 'http://www.w3.org/ns/solid/interop#',
};

function toXsdDateTime(date: Date) {
    return `"${date.toISOString()}"^^xsd:dateTime`
}


export class ExportToRDF {
    toRdfSocialAgentRegistration(registration: SocialAgentRegistration) {
        const subject = `${registration.registeredBy.identity}/agents/${registration.id}/`

        const writer = new N3.Writer(prefixes)
        writer.addQuad(
            namedNode(subject),
            namedNode('a'),
            namedNode('interop:SocialAgentRegistration')
        );
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:registeredBy'),
            literal(registration.registeredBy.getWebID())
        ));
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:registeredWith'),
            literal(registration.registeredWith.getWebID())
        ));
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:registeredAt'),
            literal(toXsdDateTime(registration.registeredAt))
        ));
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:updatedAt'),
            literal(toXsdDateTime(registration.registeredAt))
        ));
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:registeredAgent'),
            literal(registration.registeredAgent.getWebID())
        ));
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:reciprocalRegistration'),
            literal(registration.reciprocalRegistration)
        ));
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:hasAccessGrant'),
            literal(subject + registration.hasAccessGrant.id)
        ));
        writer.end((error, result: string) => {return result});
    }

}