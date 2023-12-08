import {Prefixes, Store} from "n3";
import {getResources, Rdf} from "../RDF/rdf";
import {Fetch} from "../../../fetch";
import {DataRegistration} from "../registration/data-registration";
import {DATA_REGISTRATION, INTEROP} from "../namespace";

/**
 * Represents a data registry resource.
 */
export class DataRegistryResource extends Rdf {
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  /**
   * Retrieves the data registrations associated with this data registry resource.
   * @returns A promise that resolves to an array of DataRegistration objects.
   */
  getHasDataRegistrations(): Promise<DataRegistration[]> {
    const uris = this.getObjectValuesFromPredicate(DATA_REGISTRATION) ?? [];
    return getResources(DataRegistration, this.fetch, uris);
  }

  /**
   * Adds a data registration to this data registry resource.
   * @param dataRegistration The data registration to add.
   */
  async addHasDataRegistration(dataRegistration: DataRegistration) {
    const quadDataReg = this.createTriple(
      INTEROP + "hasDataRegistration",
      dataRegistration.uri,
    );
    await this.add([quadDataReg]);
  }
}
