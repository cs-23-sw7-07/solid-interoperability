import { Prefixes, Store } from "n3";
import { Agent, ApplicationAgent, SocialAgent } from "../../agent";
import { DataRegistration } from "../../data-registration/data-registration";
import { Rdf, createTriple, getResource } from "../../RDF/rdf";
import { DataInstance } from "./data-instance";
import { NotImplementedYet } from "../../../../Errors/NotImplementedYet";
import { Fetch } from "../../../../fetch";
import { AccessMode } from "../access/access-mode";
import { INTEROP } from "../../namespace";
import { getAccessmode } from "../../../Utils";

export class Data extends Rdf {
  constructor(
    id: string,
    type: string,
    fetch: Fetch,
    dataset?: Store,
    prefixes?: Prefixes,
  ) {
    super(id, type, fetch, dataset, prefixes);
  }

  static newQuads(
    id: string,
    dataOwner: SocialAgent,
    grantee: Agent,
    registeredShapeTree: string,
    hasDataRegistration: DataRegistration,
    accessMode: AccessMode[],
    satisfiesAccessNeed: string,
    creatorAccessMode?: AccessMode[],
    hasDataInstanceIRIs?: string[],
  ) {
    const triple = (predicate: string, object: string | Date) => createTriple(id, INTEROP + predicate, object);
    const quads = [
      triple("dataOwner", dataOwner.webID),
      triple("grantee", grantee.webID),
      triple("registeredShapeTree", registeredShapeTree),
      triple("hasDataRegistration", hasDataRegistration.uri),
      triple("satisfiesAccessNeed", satisfiesAccessNeed)
    ]

    for (const mode of accessMode) {
      quads.push(triple("accessMode", mode))
    }

    if (hasDataInstanceIRIs) {
      for (const iri of hasDataInstanceIRIs) {
        quads.push(triple("hasDataInstanceIRI", iri))
      }
    }

    if (creatorAccessMode) {
      for (const mode of creatorAccessMode) {
        quads.push(triple("creatorAccessMode", mode))
      }
    }

    return quads;
  }

  public get DataOwner(): SocialAgent | undefined {
    const dataOwner = this.getObjectValueFromPredicate("dataOwner")
    if (dataOwner) {
      return new SocialAgent(dataOwner)
    }
    return undefined

  }

  public get Grantee(): Agent {
    return new ApplicationAgent(this.getObjectValueFromPredicate("grantee")!)
  }

  public get RegisteredShapeTree(): string {
    return this.getObjectValueFromPredicate("registeredShapeTree")!
  }

  public async getHasDataRegistration(): Promise<DataRegistration | undefined> {
    const iri = this.getObjectValueFromPredicate("hasDataRegistration")
    if (iri) {
      return await getResource(DataRegistration, this.fetch, iri);
    }
    return undefined
  }

  public get AccessMode(): AccessMode[] {
    const modes = this.getObjectValuesFromPredicate("accessMode")
    if (modes) {
      return modes.map(mode => getAccessmode(mode));
    }
    return []
  }

  public get CreatorAccessMode(): AccessMode[] | undefined {
    const modes = this.getObjectValuesFromPredicate("accessMode")
    if (modes) {
      return modes.map(mode => getAccessmode(mode));
    }
    return []
  }

  public get SatisfiesAccessNeed(): string {
    return this.getObjectValueFromPredicate("satisfiesAccessNeed")!
  }

  public get HasDataInstanceIRIs(): string[] | undefined {
    return this.getObjectValuesFromPredicate("hasDataInstanceIRI")
  }
}
