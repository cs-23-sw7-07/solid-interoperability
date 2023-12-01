import { Prefixes, Store } from "n3";
import { Agent, SocialAgent } from "../../agent";
import { DataRegistration } from "../../data-registration/data-registration";
import { GrantScope } from "../grant-scope";
import { Fetch } from "../../../../fetch";
import { AccessMode } from "../access/access-mode";
import { Data } from "./data";
import {createTriple, getResource} from "../../RDF/rdf";
import { INTEROP } from "../../namespace";
import {getScopeOfAuth} from "../../../Utils";

export class DataAuthorization extends Data {
  /**
   * A class which has the fields to conform to the `Data Authorization` graph defined in the Solid interoperability specification.
   * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#data-authorization
   */
  constructor(
    id: string,
    fetch: Fetch, 
    dataset?: Store,
    prefixes?: Prefixes,
  ) {
    super(id, fetch, dataset, prefixes);
  }

  static new(
    id: string,
    fetch: Fetch,
    dataOwner: SocialAgent,
    grantee: Agent,
    registeredShapeTree: string,
    hasDataRegistration: DataRegistration,
    accessMode: AccessMode[],
    scopeOfAuthorization: GrantScope,
    satisfiesAccessNeed: string,
    hasDataInstanceIRIs?: string[],
    creatorAccessMode?: AccessMode[],
    inheritsFromAuthorization?: DataAuthorization,
  ) {
    const triple = (predicate: string, object: string | Date) => createTriple(id, INTEROP + predicate, object);
    const quads = super.newQuads(id, dataOwner, grantee, registeredShapeTree, hasDataRegistration, accessMode, satisfiesAccessNeed, creatorAccessMode, hasDataInstanceIRIs)

    quads.push(triple("scopeOfAuthorization", scopeOfAuthorization))

    if (inheritsFromAuthorization) {
      quads.push(triple("inheritsFromAuthorization", inheritsFromAuthorization.uri))
    }

    return new DataAuthorization(id, fetch, new Store(quads));
  }

  public get ScopeOfAuthorization(): GrantScope {
    const scope = this.getObjectValueFromPredicate("scopeOfAuthorization")!;
    return getScopeOfAuth(scope);
  }

  public async getInheritsFromAuthorization(): Promise<DataAuthorization | undefined> {
    const iri = this.getObjectValueFromPredicate("inheritsFromAuthorization")
    if (iri) {
      return await getResource(DataAuthorization, this.fetch, iri)
    }
    return undefined
  }


  // async toDataGrant(builder: IDataGrantBuilder): Promise<DataGrant[]> {
  //   const grants: DataGrant[] = [];

  //   switch (this.scopeOfAuthorization) {
  //     case GrantScope.All:
  //     case GrantScope.AllFromAgent:
  //       for (const reg of await builder.getAllDataRegistrations(
  //         this.registeredShapeTree,
  //         this.dataOwner,
  //       )) {
  //         grants.push(
  //           new DataGrant(
  //             builder.generateId(),
  //             reg.registeredBy,
  //             this.grantee,
  //             this.registeredShapeTree,
  //             reg,
  //             this.accessMode,
  //             GrantScope.AllFromRegistry,
  //             this.satisfiesAccessNeed,
  //             undefined,
  //             this.creatorAccessMode,
  //           ),
  //         );
  //       }
  //       break;
  //     case GrantScope.AllFromRegistry:
  //       grants.push(
  //         new DataGrant(
  //           builder.generateId(),
  //           this.hasDataRegistration!.registeredBy,
  //           this.grantee,
  //           this.registeredShapeTree,
  //           this.hasDataRegistration!,
  //           this.accessMode,
  //           GrantScope.AllFromRegistry,
  //           this.satisfiesAccessNeed,
  //           undefined,
  //           this.creatorAccessMode,
  //         ),
  //       );
  //       break;
  //     case GrantScope.SelectedFromRegistry:
  //       grants.push(
  //         new DataGrant(
  //           builder.generateId(),
  //           this.dataOwner!,
  //           this.grantee,
  //           this.registeredShapeTree,
  //           this.hasDataRegistration!,
  //           this.accessMode,
  //           GrantScope.SelectedFromRegistry,
  //           this.satisfiesAccessNeed,
  //           this.hasDataInstanceIRIs,
  //           this.creatorAccessMode,
  //         ),
  //       );
  //       break;
  //     case GrantScope.Inherited:
  //       for (const inheritedGrant of await builder.getInheritedDataGrants(
  //         this,
  //       )) {
  //         grants.push(
  //           new DataGrant(
  //             builder.generateId(),
  //             this.hasDataRegistration!.registeredBy,
  //             this.grantee,
  //             this.hasDataRegistration!.registeredShapeTree,
  //             this.hasDataRegistration!,
  //             this.accessMode,
  //             GrantScope.AllFromRegistry,
  //             this.satisfiesAccessNeed,
  //             undefined,
  //             this.creatorAccessMode,
  //             inheritedGrant,
  //           ),
  //         );
  //       }
  //       break;
  //     default:
  //       throw new Error("No scope of grant is defined in the given file");
  //   }
  //   return grants;
  // }
}
