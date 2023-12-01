import N3 from "n3";
import { Agent, ApplicationAgent, SocialAgent } from "../agent";
import { AccessGrant } from "../authorization/access/access-grant";
import { Registration } from "../registration";

const { DataFactory } = N3;
const { namedNode, literal } = DataFactory;

export abstract class AgentRegistration extends Registration {
  /**
   * An abstract class which is used polymophicly where functions which both a `Social Agent Registration` or `Application Agent Resitration` can perform.
   * Has the fields which both the agent types share.
   */
  constructor(
    id: string,
    registeredBy: SocialAgent,
    registeredWith: ApplicationAgent,
    registeredAt: Date,
    updatedAt: Date,
    public registeredAgent: Agent,
    public hasAccessGrant: AccessGrant[],
  ) {
    super(
      id,
      "AgentRegistration",
      registeredBy,
      registeredWith,
      registeredAt,
      updatedAt,
    );
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
    for (const grant of this.hasAccessGrant) {
      writer.addQuad(
        subjectNode,
        namedNode("interop:hasAccessGrant"),
        namedNode(grant.id),
      );
    }
  }
}
