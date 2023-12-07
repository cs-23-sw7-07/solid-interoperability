import { Prefixes, Store } from "n3";
import { Agent, SocialAgent } from "../../agent";
import { DataGrant } from "../data";
import { Fetch } from "../../../../fetch";
import { INTEROP } from "../../namespace";
import { createTriple, getResources, newResource } from "../../RDF/rdf";
import { AccessNeedGroup } from "../access-needs/access-need-group";
import { SAIViolationMissingTripleError } from "../../../../Errors";
import { Access } from "./access";

export class AccessGrant extends Access {
  /**
   * A class which has the fields to conform to the `Access Grant` graph defined in the Solid interoperability specification.
   * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#access-grant
   */

  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

  static async new(
    id: string,
    fetch: Fetch,
    grantedBy: SocialAgent,
    grantedAt: Date,
    grantee: Agent,
    hasAccessNeedGroup: AccessNeedGroup,
    hasDataGrant: DataGrant[],
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
    for (const dataGrant of hasDataGrant) {
      quads.push(triple("hasDataGrant", dataGrant.uri));
    }
    return newResource(AccessGrant, fetch, id, "AccessGrant", quads);
  }

  public async getHasDataGrant(): Promise<DataGrant[]> {
    const uris = this.getObjectValuesFromPredicate(INTEROP + "hasDataGrant");
    if (uris) {
      return await getResources(DataGrant, this.fetch, uris);
    }
    throw new SAIViolationMissingTripleError(this, INTEROP + "hasDataGrant");
  }
}
