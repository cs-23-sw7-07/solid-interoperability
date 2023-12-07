import { Prefixes, Store } from "n3";
import { ApplicationAgent, SocialAgent } from "../agent";
import { Registration } from "../registration";
import { Fetch } from "../../../fetch";
import { INTEROP } from "../namespace";
import { createTriple, newResourceContainer } from "../RDF/rdf";

export class DataRegistration extends Registration {
  /**
   * A class which has the fields to conform to the `Data Registration` graph defined in the Solid interoperability specification.
   * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#data-registration
   */
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  static new(
    id: string,
    fetch: Fetch,
    registeredBy: SocialAgent,
    registeredWith: ApplicationAgent,
    registeredAt: Date,
    updatedAt: Date,
    registeredShapeTree: string,
  ) {
    const triple = (predicate: string, object: string | Date) =>
      createTriple(id, INTEROP + predicate, object);
    const quads = super.newQuadsReg(
      id,
      registeredBy,
      registeredWith,
      registeredAt,
      updatedAt,
    );

    quads.push(triple("registeredShapeTree", registeredShapeTree));

    return newResourceContainer(
      DataRegistration,
      fetch,
      id,
      "DataRegistration",
      quads,
    );
  }

  get RegisteredShapeTree(): string {
    return this.getObjectValueFromPredicate({ predicate: INTEROP + "registeredShapeTree" })!;
  }

  async setRegisteredShapeTree(shapeTree: string) {
    const predicate = INTEROP + "registeredShapeTree";
    const quad = this.createTriple(predicate, shapeTree);
    await this.update(predicate, [quad]);
    await this.updateDate();
  }
}
