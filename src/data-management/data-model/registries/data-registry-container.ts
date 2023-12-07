import {Prefixes, Store} from "n3";
import {getResources, Rdf} from "../RDF/rdf";
import {Fetch} from "../../../fetch";
import {DataRegistration} from "../data-registration/data-registration";
import {DATA_REGISTRATION, INTEROP} from "../namespace";

export class DataRegistryResource extends Rdf {
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  getHasDataRegistrations(): Promise<DataRegistration[]> {
    const uris = this.getObjectValuesFromPredicate(DATA_REGISTRATION) ?? [];
    return getResources(DataRegistration, this.fetch, uris);
  }

  async addHasDataRegistration(dataRegistration: DataRegistration) {
    const quadDataReg = this.createTriple(
      INTEROP + "hasDataRegistration",
      dataRegistration.uri,
    );
    await this.add([quadDataReg]);
  }
}
