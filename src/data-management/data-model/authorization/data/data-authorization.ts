import { Prefixes, Store } from "n3";
import { Agent, SocialAgent } from "../../agent";
import { DataRegistration } from "../../registration/data-registration";
import { GrantScope } from "../grant-scope";
import { Fetch } from "../../../../fetch";
import { AccessMode } from "../access";
import { Data } from "./data";
import { createTriple, getResource, newResource } from "../../RDF/rdf";
import { INTEROP } from "../../namespace";
import { AccessNeed } from "../access-needs";
import {
  SAIViolationError,
  SAIViolationMissingTripleError,
} from "../../../../Errors";
import { IDataGrantBuilder } from "./IDataGrantBuilder";
import { DataGrant } from "./data-grant";
import { getScopeOfGrant } from "../../../Utils";

/**
 * Represents a class that conforms to the `Data Authorization` graph defined in the Solid interoperability specification.
 * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#data-authorization
 */
export class DataAuthorization extends Data {
  /**
   * Creates an instance of the DataAuthorization class.
   * @param id - The identifier for the data authorization.
   * @param fetch - The fetch function used for making HTTP requests.
   * @param dataset - The quads associated with the data authorization.
   * @param prefixes - The prefixes used in the RDF.
   */
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  /**
   * Creates a new instance of DataAuthorization.
   *
   * @param id - The ID of the data authorization.
   * @param fetch - The fetch function used for making HTTP requests.
   * @param grantee - The agent being granted access.
   * @param registeredShapeTree - The registered shape tree for the data.
   * @param satisfiesAccessNeed - The access need that is satisfied by this authorization.
   * @param accessMode - The access mode(s) granted by this authorization.
   * @param scopeOfAuthorization - The scope of the authorization.
   * @param creatorAccessMode - The access mode(s) granted to the creator of the authorization (optional).
   * @param dataOwner - The social agent that owns the data (optional).
   * @param hasDataRegistration - The data registration associated with the authorization (optional).
   * @param hasDataInstance - The array of data instance IRIs associated with the authorization (optional).
   * @param inheritsFromAuthorization - The authorization from which this authorization inherits (optional).
   * @returns A new instance of DataAuthorization.
   */
  static new(
    id: string,
    fetch: Fetch,
    grantee: Agent,
    registeredShapeTree: string,
    satisfiesAccessNeed: AccessNeed,
    accessMode: AccessMode[],
    scopeOfAuthorization: GrantScope,
    creatorAccessMode?: AccessMode[],
    dataOwner?: SocialAgent,
    hasDataRegistration?: DataRegistration,
    hasDataInstance?: string[],
    inheritsFromAuthorization?: DataAuthorization,
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

    quads.push(triple("scopeOfAuthorization", scopeOfAuthorization));

    if (dataOwner) quads.push(triple("dataOwner", dataOwner.getWebID()));

    if (hasDataRegistration)
      quads.push(triple("hasDataRegistration", hasDataRegistration.uri));

    if (hasDataInstance) {
      for (const iri of hasDataInstance) {
        quads.push(triple("hasDataInstanceIRI", iri));
      }
    }

    if (inheritsFromAuthorization)
      quads.push(
        triple("inheritsFromAuthorization", inheritsFromAuthorization.uri),
      );

    return newResource(
      DataAuthorization,
      fetch,
      id,
      "DataAuthorization",
      quads,
    );
  }

  /**
   * Gets the scope of authorization.
   * @returns The scope of authorization.
   * @throws {SAIViolationMissingTripleError} If the scope of authorization is missing.
   */
  public get ScopeOfAuthorization(): GrantScope {
    const scope = this.getObjectValueFromPredicate(
      INTEROP + "scopeOfAuthorization",
    );
    if (scope) return getScopeOfGrant(scope);
    throw new SAIViolationMissingTripleError(
      this,
      INTEROP + "scopeOfAuthorization",
    );
  }

  /**
   * Gets the data owner of the authorization.
   * @returns The data owner as a SocialAgent object.
   * @throws {SAIViolationError} If the scope of authorization is GrantScope.All.
   * @throws {SAIViolationMissingTripleError} If the data owner triple is missing.
   */
  public get DataOwner(): SocialAgent {
    if (this.ScopeOfAuthorization == GrantScope.All)
      throw new SAIViolationError(
        this,
        `Since the scope of authorization is ${this.ScopeOfAuthorization} it has no data owner property.`,
      );
    const dataOwner = this.getObjectValueFromPredicate(INTEROP + "dataOwner");
    if (dataOwner) {
      return new SocialAgent(dataOwner);
    }
    throw new SAIViolationMissingTripleError(this, INTEROP + "dataOwner");
  }

  /**
   * Retrieves the data registration associated with this authorization.
   * @returns A promise that resolves to the data registration object.
   * @throws {SAIViolationError} If the scope of authorization is "All" or "AllFromAgent" as they do not have data registration attached.
   * @throws {SAIViolationMissingTripleError} If the data registration triple is missing.
   */
  public async getHasDataRegistration(): Promise<DataRegistration> {
    const scope = this.ScopeOfAuthorization;
    if (scope == GrantScope.All || scope == GrantScope.AllFromAgent)
      throw new SAIViolationError(
        this,
        "Since the scope of authorization is " +
          this.ScopeOfAuthorization +
          " it has no data registration attached.",
      );
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
   * Gets the data instances associated with the authorization.
   * @returns An array of strings representing the data instances.
   * @throws {SAIViolationError} If the scope of authorization is not "SelectedFromRegistry".
   * @throws {SAIViolationMissingTripleError} If the data instances are missing.
   */
  public get HasDataInstance(): string[] {
    if (this.ScopeOfAuthorization != GrantScope.SelectedFromRegistry)
      throw new SAIViolationError(
        this,
        "Since the scope of authorization is " +
          this.ScopeOfAuthorization +
          " it has no data instance attached.",
      );
    const iris = this.getObjectValuesFromPredicate(INTEROP + "hasDataInstance");
    if (iris) return iris;
    throw new SAIViolationMissingTripleError(this, INTEROP + "hasDataInstance");
  }

  /**
   * Retrieves the inherited authorization associated with this data authorization.
   * @returns A Promise that resolves to the inherited DataAuthorization object.
   * @throws {SAIViolationError} If the scope of authorization is not "Inherited".
   * @throws {SAIViolationMissingTripleError} If the "inheritsFromAuthorization" triple is missing.
   */
  public async getInheritsFromAuthorization(): Promise<DataAuthorization> {
    if (this.ScopeOfAuthorization != GrantScope.Inherited)
      throw new SAIViolationError(
        this,
        "Since the scope of authorization is " +
          this.ScopeOfAuthorization +
          " it has no inherited authorization attached.",
      );
    const iri = this.getObjectValueFromPredicate(
      INTEROP + "inheritsFromAuthorization",
    );
    if (iri) {
      return await getResource(DataAuthorization, this.fetch, iri);
    }
    throw new SAIViolationMissingTripleError(
      this,
      INTEROP + "inheritsFromAuthorization",
    );
  }

  /**
   * Converts the authorization data to an array of DataGrant objects.
   * @param builder The IDataGrantBuilder used to build the DataGrant objects.
   * @returns A promise that resolves to an array of DataGrant objects.
   */
  async toDataGrant(builder: IDataGrantBuilder): Promise<DataGrant[]> {
    const grants: DataGrant[] = [];

    switch (this.ScopeOfAuthorization) {
      case GrantScope.All: {
        for (const reg of await builder.getAllDataRegistrations(
          this.RegisteredShapeTree,
        )) {
          grants.push(
            await DataGrant.new(
              builder.generateId(),
              this.fetch,
              await this.getGrantee(),
              this.RegisteredShapeTree,
              await this.getSatisfiesAccessNeed(),
              this.AccessMode,
              GrantScope.AllFromRegistry,
              reg.RegisteredBy,
              reg,
              this.CreatorAccessMode,
            ),
          );
        }
        break;
      }
      case GrantScope.AllFromAgent: {
        for (const reg of await builder.getAllDataRegistrations(
          this.RegisteredShapeTree,
          this.DataOwner,
        )) {
          grants.push(
            await DataGrant.new(
              builder.generateId(),
              this.fetch,
              await this.getGrantee(),
              this.RegisteredShapeTree,
              await this.getSatisfiesAccessNeed(),
              this.AccessMode,
              GrantScope.AllFromRegistry,
              reg.RegisteredBy,
              reg,
              this.CreatorAccessMode,
            ),
          );
        }
        break;
      }
      case GrantScope.AllFromRegistry: {
        const reg = await this.getHasDataRegistration();
        grants.push(
          await DataGrant.new(
            builder.generateId(),
            this.fetch,
            await this.getGrantee(),
            this.RegisteredShapeTree,
            await this.getSatisfiesAccessNeed(),
            this.AccessMode,
            GrantScope.AllFromRegistry,
            reg.RegisteredBy,
            reg,
            this.CreatorAccessMode,
          ),
        );
        break;
      }
      case GrantScope.SelectedFromRegistry: {
        const reg = await this.getHasDataRegistration();
        grants.push(
          await DataGrant.new(
            builder.generateId(),
            this.fetch,
            await this.getGrantee(),
            this.RegisteredShapeTree,
            await this.getSatisfiesAccessNeed(),
            this.AccessMode,
            GrantScope.SelectedFromRegistry,
            reg.RegisteredBy,
            reg,
            this.CreatorAccessMode,
            this.HasDataInstance,
          ),
        );
        break;
      }
      case GrantScope.Inherited: {
        const reg = await this.getHasDataRegistration();
        for (const inheritedGrant of await builder.getInheritedDataGrants(
          this,
        )) {
          grants.push(
            await DataGrant.new(
              builder.generateId(),
              this.fetch,
              await this.getGrantee(),
              this.RegisteredShapeTree,
              await this.getSatisfiesAccessNeed(),
              this.AccessMode,
              GrantScope.Inherited,
              reg.RegisteredBy,
              reg,
              this.CreatorAccessMode,
              undefined,
              inheritedGrant,
            ),
          );
        }
        break;
      }
      default:
        throw new SAIViolationError(
          this,
          this.ScopeOfAuthorization + " is not a valid scope of authorization",
        );
    }
    return grants;
  }
}
