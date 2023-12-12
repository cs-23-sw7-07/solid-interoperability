import { Prefixes, Store } from "n3";
import { Agent, SocialAgent } from "../../agent";
import { DataRegistration } from "../../registration/data-registration";
import { GrantScope } from "../grant-scope";
import { AccessMode } from "../access/access-mode";
import { createTriple, getResource, newResource } from "../../RDF/rdf";
import { Fetch } from "../../../../fetch";
import { Data } from "./data";
import { INTEROP } from "../../namespace";
import { AccessNeed } from "../access-needs/access-need";
import {
  SAIViolationError,
  SAIViolationMissingTripleError,
} from "../../../../Errors";
import { getScopeOfGrant } from "../../../Utils";

/**
 * Represents a data grant in the Solid interoperability specification.
 * This class conforms to the `Data Grant` graph defined in the specification.
 * For more information, refer to the specification: https://solid.github.io/data-interoperability-panel/specification/#data-grant
 */
export class DataGrant extends Data {
  /**
   * Represents a DataGrant object.
   * @constructor
   * @param {string} id - The ID of the DataGrant.
   * @param {Fetch} fetch - The Fetch instance used for making HTTP requests.
   * @param {Store} [dataset] - The optional dataset associated with the DataGrant.
   * @param {Prefixes} [prefixes] - The optional prefixes used for RDF serialization.
   */
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  /**
   * Creates a new DataGrant instance.
   *
   * @param id - The ID of the data grant.
   * @param fetch - The fetch function used for making HTTP requests.
   * @param grantee - The agent being granted access.
   * @param registeredShapeTree - The URI of the registered shape tree.
   * @param satisfiesAccessNeed - The access need that is satisfied by this grant.
   * @param accessMode - The access mode(s) granted.
   * @param scopeOfGrant - The scope of the grant.
   * @param dataOwner - The social agent that owns the data.
   * @param hasDataRegistration - The data registration associated with the grant.
   * @param creatorAccessMode - The access mode(s) granted to the creator.
   * @param hasDataInstance - The URI(s) of the data instance(s) associated with the grant.
   * @param InheritsFromGrant - The data grant from which this grant inherits.
   * @returns A new DataGrant instance.
   */
  static new(
    id: string,
    fetch: Fetch,
    grantee: Agent,
    registeredShapeTree: string,
    satisfiesAccessNeed: AccessNeed,
    accessMode: AccessMode[],
    scopeOfGrant: GrantScope,
    dataOwner: SocialAgent,
    hasDataRegistration: DataRegistration,
    creatorAccessMode?: AccessMode[],
    hasDataInstance?: string[],
    InheritsFromGrant?: DataGrant,
  ) {
    const triple = (predicate: string, object: string | Date) =>
      createTriple(id, INTEROP + predicate, object);
    const quads = super.newQuads(
      id,
      grantee,
      registeredShapeTree,
      satisfiesAccessNeed,
      accessMode,
      creatorAccessMode,
    );

    quads.push(triple("scopeOfGrant", scopeOfGrant));
    quads.push(triple("dataOwner", dataOwner.WebID));
    quads.push(triple("hasDataRegistration", hasDataRegistration.uri));

    if (hasDataInstance) {
      for (const iri of hasDataInstance) {
        quads.push(triple("hasDataInstance", iri));
      }
    }

    if (InheritsFromGrant) {
      quads.push(triple("inheritsFromAuthorization", InheritsFromGrant.uri));
    }

    return newResource(DataGrant, fetch, id, "DataGrant", quads);
  }

  /**
   * Gets the data owner of the data grant.
   * @returns The data owner as a SocialAgent object.
   * @throws {SAIViolationMissingTripleError} If the data owner is missing in the data grant.
   */
  public get DataOwner(): SocialAgent {
    const dataOwner = this.getObjectValueFromPredicate(INTEROP + "dataOwner");
    if (dataOwner) {
      return new SocialAgent(dataOwner);
    }
    throw new SAIViolationMissingTripleError(this, INTEROP + "dataOwner");
  }

  /**
   * Retrieves the data registration associated with this data grant.
   * @returns A promise that resolves to a DataRegistration object.
   * @throws {SAIViolationMissingTripleError} If the data registration is missing.
   */
  public async getHasDataRegistration(): Promise<DataRegistration> {
    const iri = this.getObjectValueFromPredicate(
      INTEROP + "hasDataRegistration",
    );
    if (iri) {
      return await getResource(DataRegistration, this.fetch, iri);
    }
    throw new SAIViolationMissingTripleError(
      this,
      INTEROP + "hasDataRegistration",
    );
  }

  /**
   * Gets the scope of the grant.
   * @returns The scope of the grant.
   * @throws {SAIViolationMissingTripleError} If the scope of the grant is missing.
   */
  public get ScopeOfGrant(): GrantScope {
    const scope = this.getObjectValueFromPredicate(INTEROP + "scopeOfGrant");
    if (scope) return getScopeOfGrant(scope);
    throw new SAIViolationMissingTripleError(this, INTEROP + "scopeOfGrant");
  }

  /**
   * Gets the data instances associated with the grant.
   * @returns An array of data instance IRIs.
   * @throws {SAIViolationError} If the scope of grant is not "SelectedFromRegistry".
   * @throws {SAIViolationMissingTripleError} If the grant does not have any data instance attached.
   */
  public get HasDataInstance(): string[] {
    if (this.ScopeOfGrant != GrantScope.SelectedFromRegistry)
      throw new SAIViolationError(
        this,
        "Since the scope of grant is " +
          this.ScopeOfGrant +
          " it has no data instance attached.",
      );
    const iris = this.getObjectValuesFromPredicate(INTEROP + "hasDataInstance");
    if (iris) return iris;
    throw new SAIViolationMissingTripleError(this, INTEROP + "hasDataInstance");
  }

  /**
   * Retrieves the inherited grant associated with this data grant.
   *
   * @returns A promise that resolves to the inherited DataGrant object.
   * @throws {SAIViolationError} If the scope of the grant is not "Inherited".
   * @throws {SAIViolationMissingTripleError} If the "inheritsFromGrant" triple is missing.
   */
  public async getInheritsFromGrant(): Promise<DataGrant> {
    if (this.ScopeOfGrant != GrantScope.Inherited)
      throw new SAIViolationError(
        this,
        "Since the scope of grant is " +
          this.ScopeOfGrant +
          " it has no inherited grant attached.",
      );
    const iri = this.getObjectValueFromPredicate(INTEROP + "inheritsFromGrant");
    if (iri) {
      return await getResource(DataGrant, this.fetch, iri);
    }
    throw new SAIViolationMissingTripleError(
      this,
      INTEROP + "inheritsFromAuthorization",
    );
  }
}
