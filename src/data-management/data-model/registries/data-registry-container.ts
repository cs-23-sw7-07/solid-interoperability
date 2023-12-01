import N3, { Prefixes, Store } from "n3";
import { DatasetCore } from "@rdfjs/types";
import { Rdf, getResource } from "../RDF/rdf";
import { Fetch } from "../../../fetch";
import { DataRegistration } from "../data-registration/data-registration";
import { DATA_REGISTRATION, INTEROP } from "../namespace";
const { quad, namedNode } = N3.DataFactory;

export class DataRegistryResource extends Rdf {
    constructor(
        id: string,
        fetch: Fetch, 
        dataset?: Store,
        prefixes?: Prefixes,
      ) {
        super(
          id,
          fetch, dataset, prefixes
        );
      }

    async getHasDataRegistrations(): Promise<DataRegistration[]> {
        const values = this.getObjectValuesFromPredicate(DATA_REGISTRATION);
        if (!values) return [];

        let regs = [];
        for (const uri of values) {
            regs.push(await getResource(DataRegistration, this.fetch, uri));
        }

        return regs;
    }

    async addHasDataRegistration(dataRegistration: DataRegistration) {
        const quadDataReg = this.createTriple(
            INTEROP + "hasDataRegistration",
            dataRegistration.uri,
        );
        this.add([quadDataReg])
    }
}
