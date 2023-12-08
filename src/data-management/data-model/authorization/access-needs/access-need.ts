import {Prefixes, Store} from "n3";
import {INTEROP} from "../../namespace";
import {getResource, Rdf} from "../../RDF/rdf";
import {Fetch} from "../../../../fetch";
import {AccessMode} from "../access";
import {getAccessmode} from "../../../Utils";
import {SAIViolationMissingTripleError} from "../../../../Errors";

/**
 * Represents an access need in the Solid interoperability specification.
 */
export class AccessNeed extends Rdf {
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  /**
   * Gets the registered shape tree associated with this access need.
   * @returns The registered shape tree URL.
   * @throws {SAIViolationMissingTripleError} If the registered shape tree is missing.
   */
  get RegisteredShapeTree(): string | undefined {
    const shapeTree = this.getObjectValueFromPredicate(INTEROP + "registeredShapeTree");
    if (shapeTree) return shapeTree;
    throw new SAIViolationMissingTripleError(this, INTEROP + "registeredShapeTree");
  }

  /**
   * Gets the access modes associated with this access need.
   * @returns The access modes.
   * @throws {SAIViolationMissingTripleError} If the access modes are missing.
   */
  get AccessModes(): AccessMode[] {
    const values: string[] | undefined = this.getObjectValuesFromPredicate(
      INTEROP + "accessMode",
    );
    if (values) return values.map((mode) => getAccessmode(mode));
    throw new SAIViolationMissingTripleError(this, INTEROP + "accessMode");
  }

  /**
   * Gets the creator access modes associated with this access need.
   * @returns The creator access modes.
   */
  get CreatorAccessModes(): AccessMode[] {
    const values: string[] | undefined = this.getObjectValuesFromPredicate(
      INTEROP + "creatorAccessMode",
    );
    if (values) return values.map((mode) => getAccessmode(mode));
    return [];
  }

  /**
   * Gets the access necessity associated with this access need.
   * @returns The access necessity.
   * @throws {SAIViolationMissingTripleError} If the access necessity is missing.
   */
  get AccessNecessity(): string {
    const necessity = this.getObjectValueFromPredicate(INTEROP + "accessNecessity");
    if (necessity) return necessity;
    throw new SAIViolationMissingTripleError(this, INTEROP + "accessNecessity");
  }

  /**
   * Gets the data instances associated with this access need.
   * @returns The data instances. Returns undefined if it has no associated data instances.
   */
  get HasDataInstance(): string[] | undefined {
    return this.getObjectValuesFromPredicate(INTEROP + "hasDataInstance");
  }

  /**
   * Gets the access need that this access need inherits from.
   * @returns A promise that resolves to the inherited access need, or undefined if there is no inheritance.
   */
  async getInheritsFromNeed(): Promise<AccessNeed | undefined> {
    const inheritUri: string | undefined = this.getObjectValueFromPredicate(
      INTEROP + "inheritsFromNeed",
    );

    if (inheritUri) {
      return await getResource(AccessNeed, this.fetch, inheritUri);
    }
    return undefined;
  }
}
