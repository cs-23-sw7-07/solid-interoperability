import { Fetch } from "../../../fetch";
import { Rdf } from "../RDF/rdf";
import { Prefixes, Store } from "n3";
import {APPLICATION_PROFILE, PERSONAL_PROFILE, TYPE_A} from "../namespace";

/**
 * Represents a profile document.
 */
export class ProfileDocument extends Rdf {
  _webId: string | undefined;

  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  get WebId() {
    if (this._webId)
      return this._webId;

    // TODO: This should be specific to each kind of profile document.
    let subjects = this.dataset.getSubjects(TYPE_A, PERSONAL_PROFILE, null);
    if (subjects.length < 1)
      subjects = this.dataset.getSubjects(TYPE_A, APPLICATION_PROFILE, null);
    if (subjects.length != 1)
      throw new Error("Could not get WebId.")
    this._webId = subjects[0].value;
    return this._webId;
  }
}
