import N3 from 'n3';
const { DataFactory } = N3;
const { namedNode, literal, defaultGraph, quad, variable, blankNode } = DataFactory;

import { ApplicationtRegistration } from "../data-model/agent-registration/application-registration";
import { SocialAgentRegistration } from '../data-model/agent-registration/social-agent-registration';
import { toXsdDateTime } from '../Utils/date-utils';
import { DataRegistration } from '../data-model/data-registration/data-registration';
import { DataGrant, GrantScope } from '../data-model/access-authorization/data-grant';
import { AgentRegistration } from '../data-model/agent-registration/agent-registration';

const prefixes = {
    prefixes: {
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        acl: 'http://www.w3.org/ns/auth/acl#',
        interop: 'http://www.w3.org/ns/solid/interop#',
    }
};

export namespace ExportToRDF {
    export function toRdfSocialAgentRegistration(registration: SocialAgentRegistration): Promise<string> {
        const subject = `${registration.registeredBy.identity}agents/${registration.id}/`

        return new Promise((resolve, reject) => {
            const writer = new N3.Writer(prefixes, { format: "Turtle" })
            writer.addQuad(
                namedNode(subject),
                namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
                namedNode('interop:SocialAgentRegistration')
            );
            toRdfAgentRegistration(registration, subject, writer)
            writer.addQuad(quad(
                namedNode(subject),
                namedNode('interop:reciprocalRegistration'),
                namedNode(registration.reciprocalRegistration)
            ));

            writer.end((error, result: string) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }

            })

        })
    }

    export function toRdfApplicationRegistration(registration: ApplicationtRegistration) {
        const subject = `${registration.registeredBy.identity}agents/${registration.id}/`

        return new Promise((resolve, reject) => {
            const writer = new N3.Writer(prefixes, { format: "Turtle" })
            writer.addQuad(
                namedNode(subject),
                namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
                namedNode('interop:ApplicationRegistration')
            );
            toRdfAgentRegistration(registration, subject, writer)

            writer.end((error, result: string) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }

            })

        })
    }

    function toRdfAgentRegistration(registration: AgentRegistration, subject: string, writer: N3.Writer) {
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:registeredBy'),
            namedNode(registration.registeredBy.getWebID())
        ));
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:registeredWith'),
            namedNode(registration.registeredWith.getWebID())
        ));
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:registeredAt'),
            literal(registration.registeredAt.toISOString(), namedNode("xsd:dateTime"))
        ));
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:updatedAt'),
            literal(registration.updatedAt.toISOString(), namedNode("xsd:dateTime"))
        ));
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:registeredAgent'),
            namedNode(registration.registeredAgent.getWebID())
        ));
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:hasAccessGrant'),
            namedNode(subject + registration.hasAccessGrant.id)
        ));
    }

    export function toRdfDataRegistration(registration: DataRegistration) {
        const subject = `${registration.registeredBy.identity}/work/data/${registration.id}/`
        const writer = new N3.Writer(prefixes)
        writer.addQuad(
            namedNode(subject),
            namedNode('a'),
            namedNode('interop:DataRegistration')
        );
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:registeredBy'),
            literal(registration.registeredBy.getWebID()))
        );
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:registeredWith'),
            literal(registration.registeredWith.getWebID()))
        );
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:registeredAt'),
            literal(toXsdDateTime(registration.registeredAt)))
        );
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:updatedAt'),
            literal(toXsdDateTime(registration.updatedAt)))
        );
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:registeredShapeTree'),
            literal(registration.registeredShapeTree))
        );
    }

    export function toRdfDataGrant(grant: DataGrant) {
        const subject = `${grant.agentRegistrationIRI}/${grant.id}/`
        const writer = new N3.Writer(prefixes)
        writer.addQuad(
            namedNode(subject),
            namedNode('a'),
            namedNode('interop:DataGrant')
        );
        writer.addQuad(quad(
            namedNode(subject),
            namedNode('interop:dataOwner'),
            literal(grant.dataOwner.getWebID()))
        );
        writer.addQuad(quad(
            namedNode(subject),
            namedNode("interop:grantee"),
            literal(grant.grantee.getWebID()))
        );
        writer.addQuad(quad(
            namedNode(subject),
            namedNode("interop:registeredShapeTree"),
            literal(grant.registeredShapeTree))
        );
        writer.addQuad(quad(
            namedNode(subject),
            namedNode("interop:hasDataRegistration"),
            literal(grant.hasDataRegistration.storedAt))
        );
        writer.addQuad(quad(
            namedNode(subject),
            namedNode("interop:scopeOfGrant"),
            literal(grant.scopeOfGrant))
        );
        writer.addQuad(quad(
            namedNode(subject),
            namedNode("interop:satisfiesAccessNeed"),
            literal(grant.satisfiesAccessNeed))
        );

        writer.addQuad(
            namedNode(subject),
            namedNode("interop:hasAccessGrant"),
            writer.list(grant.accessMode.map(mode => namedNode(mode)))
        );

        if (grant.creatorAccessMode != undefined) {
            writer.addQuad(
                namedNode(subject),
                namedNode("interop:creatorAccessMode"),
                writer.list(grant.creatorAccessMode.map(mode => namedNode(mode)))
            );
        }

        if (grant.hasDataInstanceIRIs != undefined && grant.scopeOfGrant == GrantScope.SelectedFromRegistry) {
            writer.addQuad(
                namedNode(subject),
                namedNode("interop:creatorAccessMode"),
                writer.list(grant.hasDataInstanceIRIs.map(IRI => namedNode(IRI)))
            );
        }

        if (grant.inheritsFromGrant != undefined && grant.scopeOfGrant == GrantScope.Inherited) {
            writer.addQuad(quad(
                namedNode(subject),
                namedNode("interop:creatorAccessMode"),
                namedNode(grant.inheritsFromGrant.storedAt))
            );
        }

        writer.end((error, result: string) => { return result });
    }

}
