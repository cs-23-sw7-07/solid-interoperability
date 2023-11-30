import N3, { Prefixes, Store } from "n3";
import { DatasetCore } from "@rdfjs/types";
import { Agent, SocialAgent } from "../../agent";
import { DataRegistration } from "../../data-registration/data-registration";
import { ItoRdf } from "../../factory/ItoRdf";
import { GrantScope } from "../grant-scope";
import { AccessMode } from "../access/access-mode";
import {Rdf, createTriple, getResource} from "../../RDF/rdf";
import { DataInstance } from "./data-instance";
import { NotImplementedYet } from "../../../../Errors/NotImplementedYet";
import { Fetch } from "../../../../fetch";
import { Data } from "./data";
import { INTEROP } from "../../namespace";
import {getScopeOfAuth} from "../../../Utils";

const { DataFactory } = N3;
const { namedNode } = DataFactory;

export class DataGrant extends Data{
  /**
   * A class which has the fields to conform to the `Data Grant` graph defined in the Solid interoperability specification.
   * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#data-grant
   */
  constructor(
    id: string,
    fetch: Fetch, 
    dataset?: Store,
    prefixes?: Prefixes,
  ) {
    super(id, "DataGrant", fetch, dataset, prefixes);
  }

  static new(
    id: string,
    dataOwner: SocialAgent,
    grantee: Agent,
    registeredShapeTree: string,
    hasDataRegistration: DataRegistration,
    accessMode: AccessMode[],
    scopeOfGrant: GrantScope,
    satisfiesAccessNeed: string,
    hasDataInstanceIRIs?: string[],
    creatorAccessMode?: AccessMode[],
    InheritsFromGrant?: DataGrant,
  ) {
    const triple = (predicate: string, object: string | Date) => createTriple(id, INTEROP + predicate, object);
    const quads = super.newQuads(id, dataOwner, grantee, registeredShapeTree, hasDataRegistration, accessMode, satisfiesAccessNeed, creatorAccessMode, hasDataInstanceIRIs)

    quads.push(triple("scopeOfGrant", scopeOfGrant))

    if (InheritsFromGrant) {
      quads.push(triple("inheritsFromAuthorization", InheritsFromGrant.uri))
    }

    return quads;
  }


  public get ScopeOfGrant(): GrantScope {
    const scope = this.getObjectValueFromPredicate("scopeOfGrant")!;
    return getScopeOfAuth(scope);
  }


  public async getInheritsFromGrant(): Promise<DataGrant> {
    const iri = this.getObjectValueFromPredicate("inheritsFromGrant")!
    return await getResource(DataGrant, this.fetch, iri)
  }
}

