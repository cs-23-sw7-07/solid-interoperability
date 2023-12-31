import { Prefixes, Store } from "n3";
import { Fetch } from "../../../fetch";
import { Rdf } from "../RDF/rdf";

/**
 * Represents a profile document.
 */
export class ProfileDocument extends Rdf {
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }
}
