import N3 from "n3"
import { Agent, SocialAgent } from "../agent";
import { DataRegistration } from "../data-registration/data-registration";
import { ItoRdf } from "../factory/ItoRdf";

const { DataFactory } = N3;
const { namedNode, literal, quad } = DataFactory;

export enum AccessMode {
    Read = "acl:Read",
    Write = "acl:Write",
    Update = "acl:Update",
    Create = "acl:Create",
    Delete = "acl:Delete",
    Append = "acl:Append"
}

export enum GrantScope {
    All = "interop:All",
    AllFromAgent = "interop:AllFromAgent",
    AllFromRegistry = "interop:AllFromRegistry",
    SelectedFromRegistry = "interop:SelectedFromRegistry",
    Inherited = "interop:Inherited"
}

export class DataGrant implements ItoRdf {
    id: string;
    storedAt: string;
    agentRegistrationIRI: string;
    dataOwner: SocialAgent;
    grantee: Agent;
    registeredShapeTree: string; // TODO: NEED TO FINDOUT
    hasDataRegistration: DataRegistration;
    accessMode: AccessMode[];
    creatorAccessMode?: AccessMode[];
    scopeOfGrant: GrantScope;
    satisfiesAccessNeed: string; // TODO: NEED TO FINDOUT
    hasDataInstanceIRIs?: string[];
    inheritsFromGrant?: DataGrant;

    constructor(
        id: string,
        storedAt: string,
        agentRegistrationIRI: string,
        dataOwner: SocialAgent,
        grantee: Agent,
        registeredShapeTree: string,
        hasDataRegistration: DataRegistration,
        accessMode: AccessMode[],
        scopeOfGrant: GrantScope,
        satisfiesAccessNeed: string,
        hasDataInstanceIRIs?: string[],
        creatorAccessMode?: AccessMode[],
        inheritsFromGrant?: DataGrant
    ) {
        this.id = id;
        this.storedAt = storedAt;
        this.agentRegistrationIRI = agentRegistrationIRI;
        this.dataOwner = dataOwner;
        this.grantee = grantee;
        this.registeredShapeTree = registeredShapeTree;
        this.hasDataRegistration = hasDataRegistration;
        this.accessMode = accessMode;
        this.scopeOfGrant = scopeOfGrant;
        this.satisfiesAccessNeed = satisfiesAccessNeed;
        this.hasDataInstanceIRIs = hasDataInstanceIRIs;
        if (creatorAccessMode) this.creatorAccessMode = creatorAccessMode;
        if (inheritsFromGrant) this.inheritsFromGrant = inheritsFromGrant;
    }

    toRdf(writer: N3.Writer): void {
        const subjectNode = namedNode(`${this.agentRegistrationIRI}/${this.id}`)

        writer.addQuad(
            subjectNode,
            namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
            namedNode('interop:DataGrant')
        );
        writer.addQuad(
            subjectNode,
            namedNode('interop:dataOwner'),
            namedNode(this.dataOwner.identity + "/")
        );
        writer.addQuad(
            subjectNode,
            namedNode("interop:grantee"),
            namedNode(this.grantee.getWebID())
        );
        writer.addQuad(
            subjectNode,
            namedNode("interop:registeredShapeTree"),
            namedNode(this.registeredShapeTree)
        );
        writer.addQuad(
            subjectNode,
            namedNode("interop:hasDataRegistration"),
            namedNode(`${this.hasDataRegistration.storedAtFolder}/${this.hasDataRegistration.id}/`)
        );
        writer.addQuad(
            subjectNode,
            namedNode("interop:satisfiesAccessNeed"),
            namedNode(this.satisfiesAccessNeed)
        );
        writer.addQuad(
            subjectNode,
            namedNode("interop:accessMode"),
            writer.list(this.accessMode.map(mode => namedNode(mode)))
        );
        writer.addQuad(
            subjectNode,
            namedNode("interop:scopeOfGrant"),
            namedNode(this.scopeOfGrant)
        );

        if (this.creatorAccessMode != undefined) {
            writer.addQuad(
                subjectNode,
                namedNode("interop:creatorAccessMode"),
                writer.list(this.creatorAccessMode.map(mode => namedNode(mode)))
            );
        }

        if (this.hasDataInstanceIRIs != undefined && this.scopeOfGrant == GrantScope.SelectedFromRegistry) {
            writer.addQuad(
                subjectNode,
                namedNode("interop:hasDataInstance"),
                writer.list(this.hasDataInstanceIRIs.map(IRI => namedNode(IRI)))
            );
        }

        if (this.inheritsFromGrant != undefined && this.scopeOfGrant == GrantScope.Inherited) {
            writer.addQuad(quad(
                subjectNode,
                namedNode("interop:inheritsFromGrant"),
                namedNode(this.inheritsFromGrant.storedAt))
            );
        }
    }
}

