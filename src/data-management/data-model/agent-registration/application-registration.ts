import N3 from "n3";
import { ApplicationAgent, SocialAgent } from "../agent";
import { AgentRegistration } from "./agent-registration";
import { ItoRdf } from "../factory/ItoRdf";
import { AccessGrant } from "../authorization/access/access-grant";

const { DataFactory } = N3;
const { namedNode } = DataFactory;

/**
 * A class which has the fields to conform to the `Application Agent Registration` graph defined in the Solid interoperability specification.
 * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#application-registration
 */
export class ApplicationRegistration
  extends AgentRegistration
  implements ItoRdf
{
  constructor(
    id: string,
    registeredBy: SocialAgent,
    registeredWith: ApplicationAgent,
    registeredAt: Date,
    updatedAt: Date,
    registeredAgent: ApplicationAgent,
    hasAccessGrant: AccessGrant[],
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

  /* eslint-disable @typescript-eslint/no-explicit-any */
  static makeApplicationRegistration(
    argsApplicationRegistration: Map<string, any>,
  ): ApplicationRegistration {
    return new ApplicationRegistration(
      argsApplicationRegistration.get("id"),
      argsApplicationRegistration.get("registeredBy"),
      argsApplicationRegistration.get("registeredWith"),
      argsApplicationRegistration.get("registeredAt"),
      argsApplicationRegistration.get("updatedAt"),
      argsApplicationRegistration.get("registeredAgent"),
      argsApplicationRegistration.get("hasAccessGrant"),
    );
  }

  public toRdf(writer: N3.Writer): void {
    const subjectNode = namedNode(this.id);

    writer.addQuad(
      subjectNode,
      namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
      namedNode("interop:ApplicationRegistration"),
    );
    super.toRdf(writer);
  }
}
