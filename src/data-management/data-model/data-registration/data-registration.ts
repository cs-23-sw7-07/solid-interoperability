import N3 from "n3";
import { Agent, SocialAgent } from "../agent";
import {Rdf} from "../rdf";
import {Registration} from "../registration";

const { DataFactory } = N3;
const { namedNode, literal } = DataFactory;

export class DataRegistration extends Registration{
  readonly registeredShapeTree
/**
 * A class which has the fields to conform to the `Data Registration` graph defined in the Solid interoperability specification.
 * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#data-registration
 */
  constructor(
    id: string,
    registeredBy: SocialAgent,
    registeredWith: Agent,
    registeredAt: Date,
    updatedAt: Date,
    registeredShapeTree: string,
  ) {
    super(id, "DataRegistration", registeredBy, registeredWith, registeredAt, updatedAt)
    this.registeredShapeTree = registeredShapeTree;
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  static makeDataRegistration(
    argsForDataAuthorization: Map<string, any>,
  ): DataRegistration {
    return new DataRegistration(
      argsForDataAuthorization.get("id"),
      argsForDataAuthorization.get("registeredBy"),
      argsForDataAuthorization.get("registeredWith"),
      argsForDataAuthorization.get("registeredAt"),
      argsForDataAuthorization.get("updatedAt"),
      argsForDataAuthorization.get("registeredShapeTree"),
    );
  }

  toRdf(writer: N3.Writer): void {
    const subjectNode = namedNode(this.id);

    writer.addQuad(
      subjectNode,
      namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
      namedNode("interop:DataRegistration"),
    );
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
      namedNode("interop:registeredShapeTree"),
      namedNode(this.registeredShapeTree),
    );
  }
}
