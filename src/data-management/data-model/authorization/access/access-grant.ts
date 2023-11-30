import N3, { Prefixes, Store } from "n3";
import { DatasetCore } from "@rdfjs/types";
import { Agent, SocialAgent } from "../../agent";
import { ItoRdf } from "../../factory/ItoRdf";
import { DataGrant } from "../data/data-grant";
import { Rdf } from "../../RDF/rdf";
import { Fetch } from "../../../../fetch";
import { NotImplementedYet } from "../../../../Errors/NotImplementedYet";
import { Access } from "./access";
import { INTEROP } from "../../namespace";

const { DataFactory } = N3;
const { namedNode, literal } = DataFactory;

export class AccessGrant extends Access {
  /**
   * A class which has the fields to conform to the `Access Grant` graph defined in the Solid interoperability specification.
   * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#access-grant
   */

  constructor(
    id: string,
    fetch: Fetch, 
    dataset?: Store,
    prefixes?: Prefixes,
  ) {
    super(id, "AccessGrant", fetch, dataset, prefixes);
  }

  static async new(
    id: string,
    grantedBy: SocialAgent,
    grantedAt: Date,
    grantee: Agent,
    hasAccessNeedGroup: string, //Needs to Access Need Group class
    hasDataGrant: DataGrant[],) {
    const grant = new AccessGrant(id, fetch)
    const triple = (predicate: string, object: string | Date) => grant.createTriple(INTEROP + predicate, object);
    const quads = super.newQuadsAccess(id, grantedBy, grantedAt, grantee, hasAccessNeedGroup);
    for (const dataGrant of hasDataGrant) {
      quads.push(triple("hasDataGrant", dataGrant.uri))
    }
    return grant;
  }

  public get GrantedBy(): SocialAgent {
    throw new NotImplementedYet("")
  }

  public get GrantedAt(): Date {
    throw new NotImplementedYet("")
  }

  public get Grantee(): Agent {
    throw new NotImplementedYet("")
  }

  public get HasAccessNeedGroup(): string {
    throw new NotImplementedYet("")
  }

  public get HasDataGrant(): DataGrant[] {
    throw new NotImplementedYet("")
  }
}
