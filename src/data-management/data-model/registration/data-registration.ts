import { Prefixes, Store } from "n3";
import { Registration } from "./registration";
import { Fetch } from "../../../fetch";
import { INTEROP } from "../namespace";
import { createTriple, newResourceContainer } from "../RDF/rdf";
import { SocialAgent } from "../agents/socialAgent";
import { ApplicationAgent } from "../agents/applicationAgent";

/**
 * Represents a data registration in the Solid interoperability specification.
 * Inherits from the base Registration class.
 * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#data-registration
 */
export class DataRegistration extends Registration {
  /**
   * Creates a new instance of the DataRegistration class.
   * @param id - The ID of the registration.
   * @param fetch - The fetch function used for HTTP requests.
   * @param dataset - The dataset associated with the registration.
   * @param prefixes - The prefixes used for RDF serialization.
   */
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  /**
   * Creates a new instance of DataRegistration.
   * @param id - The ID of the data registration.
   * @param fetch - The fetch function used for making HTTP requests.
   * @param registeredBy - The social agent who registered the data.
   * @param registeredWith - The application agent with which the data is registered.
   * @param registeredAt - The date when the data was registered.
   * @param updatedAt - The date when the data was last updated.
   * @param registeredShapeTree - The shape tree associated with the data registration.
   * @returns A new instance of DataRegistration.
   */
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

  /**
   * Gets the registered shape tree.
   *
   * @returns The registered shape tree.
   */
  get RegisteredShapeTree(): string {
    return this.getObjectValueFromPredicate(INTEROP + "registeredShapeTree")!;
  }

  /**
   * Sets the registered shape tree for the data registration.
   *
   * @param shapeTree - The shape tree to be set.
   * @returns A promise that resolves when the shape tree is successfully set.
   */
  async setRegisteredShapeTree(shapeTree: string) {
    const predicate = INTEROP + "registeredShapeTree";
    const quad = this.createTriple(predicate, shapeTree);
    await this.update(predicate, [quad]);
    await this.updateDate();
  }
}
