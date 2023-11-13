import { DataRegistration } from "./data-registration";

/**
 * A class which has the fields to conform to the `Data Registry` graph defined in the Solid interoperability specification.
 * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#data-registry
 */
export class DataRegistry {
  hasDataRegistration: DataRegistration[];
  constructor(hasDataRegistration: DataRegistration[]) {
    this.hasDataRegistration = hasDataRegistration;
  }
}
