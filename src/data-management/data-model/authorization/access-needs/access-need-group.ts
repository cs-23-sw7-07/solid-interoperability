import { INTEROP } from "../../namespace";
import { AccessNeed } from "./access-need";
import { Prefixes, Store } from "n3";
import { getResources, Rdf } from "../../RDF/rdf";
import { Fetch } from "../../../../fetch";
import { SAIViolationMissingTripleError } from "../../../../Errors";

/**
 * Represents a AccessNeedsGroup.
 */
export class AccessNeedGroup extends Rdf {
  /**
   * Creates an instance of the AccessNeedGroup class.
   * @param id - The ID of the access need group.
   * @param fetch - The fetch function used for making HTTP requests.
   * @param dataset - The dataset used for storing quads of the AccessNeedGroup.
   * @param prefixes - The prefixes cantaining in the RDF of the AccessNeedGroup.
   */
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  /**
   * Gets the access description set associated with this access need group.
   * @returns An array of access description set URIs, or undefined if not provided.
   */
  get HasAccessDescriptionSet(): string[] | undefined {
    return this.getObjectValuesFromPredicate(
      INTEROP + "hasAccessDescriptionSet",
    );
  }

  /**
   * Gets the access necessity associated with this access need group.
   * @returns The access necessity URI, or undefined if not available.
   * @throws {SAIViolationMissingTripleError} If the access necessity are not provided.
   */
  get AccessNecessity(): string | undefined {
    const necessity = this.getObjectValueFromPredicate(
      INTEROP + "accessNecessity",
    );
    if (necessity) return necessity;
    throw new SAIViolationMissingTripleError(this, INTEROP + "accessNecessity");
  }

  /**
   * Gets the access scenarios associated with this access need group.
   * @returns An array of access scenario URIs, or undefined if not available.
   * @throws {SAIViolationMissingTripleError} If the access scenario are not provided.
   */
  get AccessScenario(): string[] {
    const accessScenario = this.getObjectValuesFromPredicate(
      INTEROP + "accessScenario",
    );
    if (accessScenario) return accessScenario;
    throw new SAIViolationMissingTripleError(this, INTEROP + "accessScenario");
  }

  /**
   * Gets the type of agent associated with this access need group.
   * @returns The authentication URI, or undefined if not available.
   * @throws {SAIViolationMissingTripleError} If the authenticate as are not provided.
   */
  get AuthenticatesAs(): string {
    const authenticatesAs = this.getObjectValueFromPredicate(
      INTEROP + "authenticatesAs",
    );
    if (authenticatesAs) return authenticatesAs;
    throw new SAIViolationMissingTripleError(this, INTEROP + "authenticatesAs");
  }

  /**
   * Retrieves the access needs associated with this access need group.
   * @returns A promise that resolves to an array of AccessNeed objects.
   * @throws {SAIViolationMissingTripleError} If the access needs are not provided.
   */
  async getHasAccessNeed(): Promise<AccessNeed[]> {
    const needUris = this.getObjectValuesFromPredicate(
      INTEROP + "hasAccessNeed",
    );
    if (needUris) return getResources(AccessNeed, this.fetch, needUris);
    throw new SAIViolationMissingTripleError(this, INTEROP + "hasAccessNeed");
  }

  /**
   * Gets the URI of the access need group that this group replaces.
   * @returns The URI of the replaced access need group, or undefined if not replace any.
   */
  get Replaces(): string | undefined {
    return this.getObjectValueFromPredicate(INTEROP + "replaces");
  }
}
