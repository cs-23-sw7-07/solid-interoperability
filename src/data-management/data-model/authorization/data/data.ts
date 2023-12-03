import { Prefixes, Store } from "n3";
import { Agent, ApplicationAgent, SocialAgent } from "../../agent";
import { Rdf, createTriple, getResource } from "../../RDF/rdf";
import { Fetch } from "../../../../fetch";
import { AccessMode } from "../access/access-mode";
import { INTEROP } from "../../namespace";
import { getAccessmode } from "../../../Utils";
import { AccessNeed } from "../access-needs/access-need";
import { SAIViolationMissingTripleError } from "../../../../Errors";

export class Data extends Rdf {
  constructor(
    id: string,
    fetch: Fetch,
    dataset?: Store,
    prefixes?: Prefixes,
  ) {
    super(id, fetch, dataset, prefixes);
  }

  static newQuads(
    id: string,
    grantee: Agent,
    registeredShapeTree: string,
    satisfiesAccessNeed: AccessNeed,
    accessMode: AccessMode[],
    creatorAccessMode?: AccessMode[],
  ) {
    const triple = (predicate: string, object: string | Date) => createTriple(id, INTEROP + predicate, object);
    const quads = [
      triple("grantee", grantee.webID),
      triple("registeredShapeTree", registeredShapeTree),
      triple("satisfiesAccessNeed", satisfiesAccessNeed.uri)
    ]

    for (const mode of accessMode) {
      quads.push(triple("accessMode", mode))
    }

    if (creatorAccessMode) {
      for (const mode of creatorAccessMode) {
        quads.push(triple("creatorAccessMode", mode))
      }
    }

    return quads;
  }


  public get Grantee(): Agent {
    const grantee = this.getObjectValueFromPredicate(INTEROP + "grantee");
    if (grantee)
      return new ApplicationAgent(grantee);
    throw new SAIViolationMissingTripleError(this, INTEROP + "grantee");
  }

  public get RegisteredShapeTree(): string {
    const registeredShapeTree = this.getObjectValueFromPredicate(INTEROP + "registeredShapeTree");
    if (registeredShapeTree)
      return registeredShapeTree;
    throw new SAIViolationMissingTripleError(this, INTEROP + "registeredShapeTree");
  }

  public async getSatisfiesAccessNeed(): Promise<AccessNeed> {
    const uri = this.getObjectValueFromPredicate("satisfiesAccessNeed");
    if (uri)
      return await getResource(AccessNeed, this.fetch, uri);
    throw new SAIViolationMissingTripleError(this, INTEROP + "satisfiesAccessNeed");
  }


  public get AccessMode(): AccessMode[] {
    const modes = this.getObjectValuesFromPredicate("accessMode")
    if (modes) {
      return modes.map(mode => getAccessmode(mode));
    }
    throw new SAIViolationMissingTripleError(this, INTEROP + "accessMode");
  }

  public get CreatorAccessMode(): AccessMode[] {
    const modes = this.getObjectValuesFromPredicate("creatorAccessMode  ")
    if (modes) {
      return modes.map(mode => getAccessmode(mode));
    }
    return []
  }
}
