import N3 from "n3";
import { ItoRdf } from "../factory/ItoRdf";
import { Agent, ApplicationAgent, SocialAgent } from "../agent";
import { AccessGrant } from "../authorization/access-grant";
import {Rdf} from "../rdf";
import {DataRegistration} from "../data-registration/data-registration";
import {Registration} from "../registration";

const { DataFactory } = N3;
const { namedNode, literal } = DataFactory;

export abstract class AgentRegistration extends Registration {
  registeredAgent: Agent;
  hasAccessGrant: AccessGrant;

  constructor(
    id: string,
    registeredBy: SocialAgent,
    registeredWith: ApplicationAgent,
    registeredAt: Date,
    updatedAt: Date,
    registeredAgent: Agent,
    hasAccessGrant: AccessGrant,
  ) {
    super(id, "hello", registeredBy, registeredWith, registeredAt, updatedAt)
    this.registeredAgent = registeredAgent;
    this.hasAccessGrant = hasAccessGrant;
  }

  public toRdf(writer: N3.Writer) {
    const subjectNode = namedNode(this.id);

    writer.addQuad(
      subjectNode,
      namedNode("interop:registeredBy"),
      namedNode(this.registeredBy.getWebID()),
    );
    writer.addQuad(
      subjectNode,
      namedNode("interop:registeredWith"),
      namedNode(this.registeredWith.getWebID()),
    );
    writer.addQuad(
      subjectNode,
      namedNode("interop:registeredAt"),
      literal(this.registeredAt.toISOString(), namedNode("xsd:dateTime")),
    );
    writer.addQuad(
      subjectNode,
      namedNode("interop:updatedAt"),
      literal(this.updatedAt.toISOString(), namedNode("xsd:dateTime")),
    );
    writer.addQuad(
      subjectNode,
      namedNode("interop:registeredAgent"),
      namedNode(this.registeredAgent.getWebID()),
    );
    writer.addQuad(
      subjectNode,
      namedNode("interop:hasAccessGrant"),
      namedNode(this.hasAccessGrant.id),
    );
  }
}
