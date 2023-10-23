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


export class ExportToRDF {
    toRdfSocialAgentRegistration(registration: SocialAgentRegistration) {
        const webid = "https://alice.example/"
        const registeredWith = "https://jarvis.example/"
        const registeredAgent = "https://bob.example"

        const registration_subject = `${webid}agents/c4562da9\/`

        const writer = new N3.Writer(prefixes)
        writer.addQuad(
            namedNode(registration_subject),
            namedNode('a'),
            namedNode('interop:SocialAgentRegistration')
        );
        writer.addQuad(quad(
            namedNode(registration_subject),
            namedNode('interop:registeredBy'),
            literal(`${webid}/#id`)
        ));
        writer.end((error, result: string) => {return result});
    }

}