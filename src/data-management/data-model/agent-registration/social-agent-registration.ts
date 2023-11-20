import N3 from "n3";
import { ApplicationAgent, SocialAgent } from "../agent";
import { AgentRegistration } from "./agent-registration";
import { AccessGrant } from "../authorization/access/access-grant";

const { DataFactory } = N3;
const { namedNode } = DataFactory;

/**
 * A class which has the fields to conform to the `Social Agent Registration` graph defined in the Solid interoperability specification.
 * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#social-agent-registration
 */
export class SocialAgentRegistration extends AgentRegistration {
  constructor(
    id: string,
    registeredBy: SocialAgent,
    registeredWith: ApplicationAgent,
    registeredAt: Date,
    updatedAt: Date,
    registeredAgent: SocialAgent,
    hasAccessGrant: AccessGrant[],
    public reciprocalRegistration: string,
  ) {
    super(
      id,
      registeredBy,
      registeredWith,
      registeredAt,
      updatedAt,
      registeredAgent,
      hasAccessGrant,
    );
  }

  public toRdf(writer: N3.Writer): void {
    const subjectNode = namedNode(this.id);

    writer.addQuad(
      subjectNode,
      namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
      namedNode("interop:SocialAgentRegistration"),
    );
    super.toRdf(writer);
    writer.addQuad(
      subjectNode,
      namedNode("interop:reciprocalRegistration"),
      namedNode(this.reciprocalRegistration),
    );
  }
}
