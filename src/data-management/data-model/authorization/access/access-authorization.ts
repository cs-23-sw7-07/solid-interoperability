import { Prefixes, Store } from "n3";
import { Agent, ApplicationAgent, SocialAgent } from "../../agent";
import { AccessGrant } from "./access-grant";
import { DataAuthorization, DataGrant } from "../data";
import { Fetch } from "../../../../fetch";
import { INTEROP } from "../../namespace";
import { Access } from "./access";
import {
  createTriple,
  getResource,
  getResources,
  newResource,
} from "../../RDF/rdf";
import { AccessNeedGroup } from "../access-needs";
import { SAIViolationMissingTripleError } from "../../../../Errors";

/**
 * Represents an access authorization in the Solid interoperability specification.
 * An access authorization grants access to a resource to a specific agent.
 * It contains information such as the granting agent, the granted agent, and the associated data authorizations.
 * Definition of the structure: https://solid.github.io/data-interoperability-panel/specification/#access-authorization
 * @extends Access
 */
export class AccessAuthorization extends Access {
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  /**
   * Creates a new AccessAuthorization instance.
   * 
   * @param id - The ID of the access authorization.
   * @param fetch - The fetch function used to fetch resources.
   * @param grantedBy - The social agent who granted the access.
   * @param grantedWith - The application agent used to grant the access.
   * @param grantedAt - The date when the access was granted.
   * @param grantee - The agent who is granted the access.
   * @param hasAccessNeedGroup - The access need group associated with the access.
   * @param hasDataAuthorization - The data authorizations associated with the access.
   * @param replaces - (Optional) The access authorization being replaced.
   * @returns A new AccessAuthorization instance.
   */
  static async new(
    id: string,
    fetch: Fetch,
    grantedBy: SocialAgent,
    grantedWith: ApplicationAgent,
    grantedAt: Date,
    grantee: Agent,
    hasAccessNeedGroup: AccessNeedGroup,
    hasDataAuthorization: DataAuthorization[],
    replaces?: AccessAuthorization,
  ) {
    const triple = (predicate: string, object: string | Date) =>
      createTriple(id, INTEROP + predicate, object);
    const quads = super.newQuadsAccess(
      id,
      grantedBy,
      grantedAt,
      grantee,
      hasAccessNeedGroup,
    );

    quads.push(triple("grantedWith", grantedWith.getWebID()));

    for (const dataAuth of hasDataAuthorization) {
      quads.push(triple("hasDataAuthorization", dataAuth.uri));
    }
    if (replaces) {
      quads.push(triple("replaces", replaces.uri));
    }
    return newResource(
      AccessAuthorization,
      fetch,
      id,
      "AccessAuthorization",
      quads,
    );
  }

  /**
   * Converts the access authorization to an access grant.
   * @param id - The ID of the access grant.
   * @param data_grants - An array of data grants that couples to the access grant.
   * @returns The converted access grant.
   */
  public async toAccessGrant(id: string, data_grants: DataGrant[]) {
    return AccessGrant.new(
      id,
      this.fetch,
      this.GrantedBy,
      this.GrantedAt,
      await this.getGrantee(),
      await this.getHasAccessNeedGroup(),
      data_grants,
    );
  }

  /**
   * Gets the application agent that granted the access authorization.
   * @returns {ApplicationAgent} The application agent that granted the access authorization.
   * @throws {SAIViolationMissingTripleError} If the grantedWith value is missing.
   */
  get GrantedWith(): ApplicationAgent {
    const grantedWith = this.getObjectValueFromPredicate(
      INTEROP + "grantedWith",
    );
    if (grantedWith) return new ApplicationAgent(grantedWith);
    throw new SAIViolationMissingTripleError(this, INTEROP + "grantedWith");
  }

  /**
   * Retrieves the data authorizations associated with this access authorization.
   * @returns A promise that resolves to an array of DataAuthorization objects.
   * @throws {SAIViolationMissingTripleError} If the "hasDataAuthorization" predicate is missing.
   */
  async getHasDataAuthorization(): Promise<DataAuthorization[]> {
    const uris = this.getObjectValuesFromPredicate(
      INTEROP + "hasDataAuthorization",
    );
    if (uris) {
      return await getResources(DataAuthorization, this.fetch, uris);
    }
    throw new SAIViolationMissingTripleError(
      this,
      INTEROP + "hasDataAuthorization",
    );
  }

  /**
   * Retrieves the AccessAuthorization object that this AccessAuthorization replaces.
   * @returns A Promise that resolves to the AccessAuthorization object, or undefined if it does not replace any.
   */
  async getReplaces(): Promise<AccessAuthorization | undefined> {
    const uri = this.getObjectValueFromPredicate(INTEROP + "replaces");
    if (uri) {
      return await getResource(AccessAuthorization, this.fetch, uri);
    }
    return undefined;
  }
}
