import { Prefixes, Store } from "n3";
import { Agent, SocialAgent } from "../../agent";
import { DataGrant } from "../data";
import { Fetch } from "../../../../fetch";
import { INTEROP } from "../../namespace";
import { createTriple, getResources, newResource } from "../../RDF/rdf";
import { AccessNeedGroup } from "../access-needs/access-need-group";
import { SAIViolationMissingTripleError } from "../../../../Errors";
import { Access } from "./access";

/**
 * Represents an access grant in the Solid interoperability specification.
 * An access grant is a permission given to an agent to access a resource.
 * It contains information such as the granting agent, the grantee, and the associated data grants.
 * Definition of the structure: https://solid.github.io/data-interoperability-panel/specification/#access-grant
 * @extends Access
 */
export class AccessGrant extends Access {
  /**
   * Creates an instance of the AccessGrant class.
   * @param id - The ID of the access grant.
   * @param fetch - The fetch function used for making HTTP requests.
   * @param dataset - The dataset associated with the access grant.
   * @param prefixes - The prefixes used for in RDF.
   */
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  /**
   * Creates a new AccessGrant instance.
   * @param id - The ID of the AccessGrant.
   * @param fetch - The fetch function used for making HTTP requests.
   * @param grantedBy - The SocialAgent who granted the access.
   * @param grantee - The Agent who is granted access.
   * @param hasAccessNeedGroup - The AccessNeedGroup associated with the access.
   * @param hasDataGrant - An array of DataGrant instances associated with the access.
   * @returns A new AccessGrant instance.
   */
  static async new(
    id: string,
    fetch: Fetch,
    grantedBy: SocialAgent,
    grantee: Agent,
    hasAccessNeedGroup: AccessNeedGroup,
    hasDataGrant: DataGrant[],
  ) {
    const triple = (predicate: string, object: string | Date) =>
      createTriple(id, INTEROP + predicate, object);
    const quads = super.newQuadsAccess(
      id,
      grantedBy,
      new Date(),
      grantee,
      hasAccessNeedGroup,
    );
    for (const dataGrant of hasDataGrant) {
      quads.push(triple("hasDataGrant", dataGrant.uri));
    }
    return newResource(AccessGrant, fetch, id, "AccessGrant", quads);
  }

  /**
   * Retrieves the data grants associated with this access grant.
   * @returns A promise that resolves to an array of DataGrant objects.
   * @throws {SAIViolationMissingTripleError} If the "hasDataGrant" predicate is missing.
   */
  public async getHasDataGrant(): Promise<DataGrant[]> {
    const uris = this.getObjectValuesFromPredicate(INTEROP + "hasDataGrant");
    if (uris) {
      return await getResources(DataGrant, this.fetch, uris);
    }
    throw new SAIViolationMissingTripleError(this, INTEROP + "hasDataGrant");
  }
}
