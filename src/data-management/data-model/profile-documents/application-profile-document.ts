import {INTEROP} from "../namespace";
import {Prefixes, Store} from "n3";
import {getResources} from "../RDF/rdf";
import {Fetch} from "../../../fetch";
import {AccessNeedGroup} from "../authorization/access-needs";
import {ProfileDocument} from "./profile-document";
import {SAIViolationMissingTripleError} from "../../../Errors";

/**
 * Represents an application profile document.
 */
export class ApplicationProfileDocument extends ProfileDocument {
  /**
   * Creates a new instance of the ApplicationProfileDocument class.
   * @param id - The ID of the document.
   * @param fetch - The fetch function used to retrieve data.
   * @param dataset - The quads associated with the document.
   * @param prefixes - The prefixes used in the document.
   */
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  /**
   * Gets the application name.
   * @returns The application name.
   * @throws {SAIViolationMissingTripleError} If the application name is missing.
   */
  get ApplicationName(): string {
    const name = this.getObjectValueFromPredicate(INTEROP + "applicationName");
    if (name) return name;
    throw new SAIViolationMissingTripleError(this, INTEROP + "applicationName");
  }

  /**
   * Gets the application description.
   * @returns The application description.
   * @throws {SAIViolationMissingTripleError} If the application description is missing.
   */
  get ApplicationDescription(): string {
    const description = this.getObjectValueFromPredicate(INTEROP + "applicationDescription");
    if (description) return description;
    throw new SAIViolationMissingTripleError(this, INTEROP + "applicationDescription");
  }

  /**
   * Gets the application author.
   * @returns The application author.
   * @throws {SAIViolationMissingTripleError} If the application author is missing.
   */
  get ApplicationAuthor(): string {
    const author = this.getObjectValueFromPredicate(INTEROP + "applicationAuthor");
    if (author) return author;
    throw new SAIViolationMissingTripleError(this, INTEROP + "applicationAuthor");
  }

  /**
   * Gets the application thumbnail.
   * @returns The application thumbnail, or undefined if it is missing.
   */
  get ApplicationThumbnail(): string | undefined {
    return this.getObjectValueFromPredicate(INTEROP + "applicationThumbnail");
  }

  /**
   * Gets the access need groups associated with the application.
   * @returns A promise that resolves to an array of AccessNeedGroup objects.
   * @throws {SAIViolationMissingTripleError} If the access need groups are missing.
   */
  getHasAccessNeedGroup(): Promise<AccessNeedGroup[]> {
    const uris = this.getObjectValuesFromPredicate(INTEROP + "hasAccessNeedGroup");
    if (uris) return getResources(AccessNeedGroup, this.fetch, uris);
    throw new SAIViolationMissingTripleError(this, INTEROP + "hasAccessNeedGroup");
  }

  /**
   * Gets the authorization callback endpoint for the application.
   * @returns The authorization callback endpoint, or undefined if it is missing.
   */
  get HasAuthorizationCallbackEndpoint(): string | undefined {
    return this.getObjectValueFromPredicate(INTEROP + "hasAuthorizationCallbackEndpoint");
  }
}
