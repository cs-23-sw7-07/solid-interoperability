import { Agent } from "../../agent";
import { createTriple, getResource, Rdf } from "../../RDF/rdf";
import { AccessMode } from "../access/access-mode";
import { INTEROP } from "../../namespace";
import { accessModeFromEnum, getAccessmode } from "../../../Utils";
import { AccessNeed } from "../access-needs/access-need";
import { SAIViolationMissingTripleError } from "../../../../Errors";
import { getAgent } from "../../../Utils/get-grantee";

/**
 * Represents an abstract class for data in the authorization or grant.
 */
export abstract class Data extends Rdf {
  /**
   * Creates an array of RDF quads representing data for authorizations or grants.
   * @param id - The ID of the data authorizations or grants.
   * @param grantee - The agent being granted access.
   * @param registeredShapeTree - The registered shape tree of the authorizations or grants.
   * @param satisfiesAccessNeed - The access need being satisfied.
   * @param accessMode - An array of access modes.
   * @param creatorAccessMode - An optional array of access modes for the creator.
   * @returns An array of RDF quads representing the data authorizations or grants.
   */
  static newQuads(
    id: string,
    grantee: Agent,
    registeredShapeTree: string,
    satisfiesAccessNeed: AccessNeed,
    accessMode: AccessMode[],
    creatorAccessMode?: AccessMode[],
  ) {
    const triple = (predicate: string, object: string | Date) =>
      createTriple(id, INTEROP + predicate, object);
    const quads = [
      triple("grantee", grantee.getWebID()),
      triple("registeredShapeTree", registeredShapeTree),
      triple("satisfiesAccessNeed", satisfiesAccessNeed.uri),
    ];

    for (const mode of accessMode) {
      quads.push(triple("accessMode", accessModeFromEnum(mode)));
    }

    if (creatorAccessMode) {
      for (const mode of creatorAccessMode) {
        quads.push(triple("creatorAccessMode", accessModeFromEnum(mode)));
      }
    }

    return quads;
  }

  /**
   * Retrieves the grantee for this data authorizations or grants.
   * @returns A promise that resolves to an instance of the Agent class.
   */
  public getGrantee(): Promise<Agent> {
    return getAgent(this, this.fetch, "grantee");
  }

  /**
   * Gets the registered shape tree.
   * @returns The registered shape tree.
   * @throws {SAIViolationMissingTripleError} If the registered shape tree is missing.
   */
  public get RegisteredShapeTree(): string {
    const registeredShapeTree = this.getObjectValueFromPredicate(
      INTEROP + "registeredShapeTree",
    );
    if (registeredShapeTree) return registeredShapeTree;
    throw new SAIViolationMissingTripleError(
      this,
      INTEROP + "registeredShapeTree",
    );
  }

  /**
   * Retrieves the AccessNeed that satisfies the data authorizations or grants.
   * @returns A Promise that resolves to the AccessNeed object.
   * @throws {SAIViolationMissingTripleError} If the satisfies access need predicate is missing.
   */
  public async getSatisfiesAccessNeed(): Promise<AccessNeed> {
    const uri = this.getObjectValueFromPredicate(
      INTEROP + "satisfiesAccessNeed",
    );
    if (uri) return await getResource(AccessNeed, this.fetch, uri);
    throw new SAIViolationMissingTripleError(
      this,
      INTEROP + "satisfiesAccessNeed",
    );
  }

  /**
   * Gets the access modes for the data authorization or grant.
   * @returns An array of AccessMode objects.
   * @throws {SAIViolationMissingTripleError} If the access modes are missing.
   */
  public get AccessMode(): AccessMode[] {
    const modes = this.getObjectValuesFromPredicate(INTEROP + "accessMode");
    if (modes) {
      return modes.map((mode) => getAccessmode(mode));
    }
    throw new SAIViolationMissingTripleError(this, INTEROP + "accessMode");
  }

  /**
   * Gets the access modes for the creator of the data authorization or grant.
   * @returns An array of AccessMode objects representing the access modes for the creator.
   */
  public get CreatorAccessMode(): AccessMode[] {
    const modes = this.getObjectValuesFromPredicate(
      INTEROP + "creatorAccessMode",
    );
    if (modes) {
      return modes.map((mode) => getAccessmode(mode));
    }
    return [];
  }
}
