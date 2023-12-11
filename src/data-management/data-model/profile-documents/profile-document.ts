import { Fetch } from "../../../fetch";
import { Rdf } from "../RDF/rdf";
import { Prefixes, Store } from "n3";

/**
 * Represents a profile document.
 */
export class ProfileDocument extends Rdf {
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  get WebId() {
    return this.uri;
  }
}
