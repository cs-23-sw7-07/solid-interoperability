import N3, { Prefixes, Store } from "n3";
import { DatasetCore } from "@rdfjs/types";
import {Agent, ApplicationAgent, SocialAgent} from "../agent";
import { Registration } from "../registration";
import { Fetch } from "../../../fetch";
import { NotImplementedYet } from "../../../Errors/NotImplementedYet";
import {INTEROP} from "../namespace";

const { DataFactory } = N3;
const { namedNode, literal } = DataFactory;

export class DataRegistration extends Registration {
  /**
   * A class which has the fields to conform to the `Data Registration` graph defined in the Solid interoperability specification.
   * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#data-registration
   */
  // constructor(
  //   id: string,
  //   registeredBy: SocialAgent,
  //   registeredWith: Agent,
  //   registeredAt: Date,
  //   updatedAt: Date,
  //   registeredShapeTree: string,
  // ) {
  //   super(
  //     id,
  //     "DataRegistration",
  //     registeredBy,
  //     registeredWith,
  //     registeredAt,
  //     updatedAt,
  //   );
  //   this.registeredShapeTree = registeredShapeTree;
  // }

  constructor(
    id: string,
    fetch: Fetch, 
    dataset?: Store,
    prefixes?: Prefixes,
  ) {
    super(
      id,
      "DataRegistration",
      fetch, dataset, prefixes
    );
  }

  get RegisteredShapeTree(): string {
    return this.getObjectValueFromPredicate(INTEROP + "registeredShapeTree")!
  }

  async setRegisteredShapeTree(shapeTree: string) {
    const predicate = INTEROP + "registeredShapeTree";
    const quad = this.createTriple(predicate, shapeTree)
    await this.update(predicate, [quad])
    await this.updateDate()
  }

}
