import N3 from "n3"
import { Agent, ApplicationAgent, SocialAgent } from "../agent";
import { ItoRdf } from "../factory/ItoRdf";
import { DataAuthorization } from "./data-authorization";

const { DataFactory } = N3;
const { namedNode, literal } = DataFactory;

export class AccessAuthorization implements ItoRdf {
    grantedBy: SocialAgent;
    grantedAt: Date;
    grantedWith: ApplicationAgent;
    grantee: Agent;
    hasAccessNeedGroup: string;
    hasDataAuthorization: DataAuthorization[];
    replaces?: AccessAuthorization;
    id: string;
    constructor(
        id: string,
        grantedBy: SocialAgent,
        grantedWith: ApplicationAgent,
        grantedAt: Date,
        grantee: Agent,
        hasAccessNeedGroup: string, //Needs to Access Need Group class
        hasDataAuthorization: DataAuthorization[],
        replaces?: AccessAuthorization
    ) {
        this.id = id;
        this.grantedBy = grantedBy;
        this.grantedWith = grantedWith;
        this.grantedAt = grantedAt;
        this.grantee = grantee;
        this.hasAccessNeedGroup = hasAccessNeedGroup;
        this.hasDataAuthorization = hasDataAuthorization;
        this.replaces = replaces;

    }

    toRdf(writer: N3.Writer): void {
        const subject = `${this.grantedBy.identity}/authorization/${this.id}`
        const subjectNode = namedNode(subject)

        writer.addQuad(
            subjectNode,
            namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
            namedNode('interop:AccessAuthorization')
        );
        writer.addQuad(
            subjectNode,
            namedNode('interop:grantedBy'),
            namedNode(this.grantedBy.getWebID())
        );
        writer.addQuad(
            subjectNode,
            namedNode('interop:grantedWith'),
            namedNode(this.grantedWith.getWebID())
        );
        writer.addQuad(
            subjectNode,
            namedNode('interop:grantedAt'),
            literal(this.grantedAt.toISOString(), namedNode("xsd:dateTime"))
        );
        writer.addQuad(
            subjectNode,
            namedNode("interop:grantee"),
            namedNode(this.grantee.getWebID())
        );
        writer.addQuad(
            subjectNode,
            namedNode("interop:hasAccessNeedGroup"),
            namedNode(this.hasAccessNeedGroup)
        );

        this.hasDataAuthorization.forEach(data_authorization => {
            writer.addQuad(
                subjectNode,
                namedNode("interop:hasDataAuthorization"),
                namedNode(`${data_authorization.storedAt}/${data_authorization.id}`)
            );
        });
        if (this.replaces !== undefined){
            writer.addQuad(
                subjectNode,
                namedNode("interop:replaces"),
                namedNode(`${this.grantedBy.identity}/authorization/${this.replaces.id}`)
            );
        }
    }
}