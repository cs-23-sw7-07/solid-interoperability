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

  toRdfApplicationRegistration(registration: ApplicationtRegistration) {
    const webid = "https://alice.example/"
    const registration_subject = `${webid}agents/c4562da9\/`

    const writer = new N3.Writer(prefixes)
    writer.addQuad(
      namedNode(registration_subject),
      namedNode('a'),
      namedNode('interop:ApplicationRegistration')
    );
    writer.addQuad(quad(
      namedNode(registration_subject),
      namedNode('interop:registeredBy'),
      literal(registration.registeredBy.getWebID()))
    );
    writer.addQuad(quad(
      namedNode(registration_subject),
      namedNode("interop:registeredAt "),
      literal(`"${registration.registeredAt.toISOString()}}"^^xsd:dateTime"`))
    );
    writer.addQuad(quad(
      namedNode(registration_subject),
      namedNode("interop:updatedAt "),
      literal(`"${registration.updatedAt.toISOString()}}"^^xsd:dateTime"`))
    );
    writer.addQuad(quad(
      namedNode(registration_subject),
      namedNode("interop:registeredAgent "),
      literal(`${registration.registeredAgent}\#id`))
    );
    writer.addQuad(quad(
      namedNode(registration_subject),
      namedNode("interop:hasAccessGrant "),
      literal(`${registration.hasAccessGrant.toLiteral()}`))
    );
    writer.end((error, result: string) => { return result });
  }

}

