import N3 from "n3";
import { Agent, SocialAgent } from "../agent";
import { ItoRdf } from "../factory/ItoRdf";
import { DataGrant } from "./data-grant";

const { DataFactory } = N3;
const { namedNode, literal } = DataFactory;

/**
 * A class which has the fields to conform to the `Access Grant` graph defined in the Solid interoperability specification.
 * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#access-grant
 */
export class AccessGrant implements ItoRdf {
  id: string;
  agentRegistrationIRI: string;
  grantedBy: SocialAgent;
  grantedAt: Date;
  grantee: Agent;
  hasAccessNeedGroup: string;
  hasDataGrant: DataGrant[];

  constructor(
    id: string,
    agentRegistrationIRI: string,
    grantedBy: SocialAgent,
    grantedAt: Date,
    grantee: Agent,
    hasAccessNeedGroup: string,
    hasDataGrant: DataGrant[],
  ) {
    this.id = id;
    this.agentRegistrationIRI = agentRegistrationIRI;
    this.grantedBy = grantedBy;
    this.grantedAt = grantedAt;
    this.grantee = grantee;
    this.hasAccessNeedGroup = hasAccessNeedGroup;
    this.hasDataGrant = hasDataGrant;
  }

  toRdf(writer: N3.Writer): void {
    const subjectNode = namedNode(this.id);

    writer.addQuad(
      subjectNode,
      namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
      namedNode("interop:AccessGrant"),
    );
    writer.addQuad(
      subjectNode,
      namedNode("interop:grantedBy"),
      namedNode(this.grantedBy.getWebID()),
    );
    writer.addQuad(
      subjectNode,
      namedNode("interop:grantedAt"),
      literal(this.grantedAt.toISOString(), namedNode("xsd:dateTime")),
    );
    writer.addQuad(
      subjectNode,
      namedNode("interop:grantee"),
      namedNode(this.grantee.getWebID()),
    );
    writer.addQuad(
      subjectNode,
      namedNode("interop:hasAccessNeedGroup"),
      namedNode(this.hasAccessNeedGroup),
    );

    this.hasDataGrant.forEach((data_grant) => {
      writer.addQuad(
        subjectNode,
        namedNode("interop:hasDataGrant"),
        namedNode(data_grant.id),
      );
    });
  }
}
