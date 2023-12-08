import {createTriple, Rdf} from "../RDF/rdf";
import {ApplicationAgent, SocialAgent} from "../agent";
import {INTEROP} from "../namespace";
import {getDate} from "../../Utils";
import {Quad} from "n3";
import {SAIViolationMissingTripleError} from "../../../Errors";

/**
 * Represents an abstract class for registration.
 * Provides methods for setting and getting registration details such as registeredBy, registeredWith, registeredAt, and updatedAt.
 */
export abstract class Registration extends Rdf {
  /**
   * Creates an array of quads representing the registration information.
   * @param id - The ID of the registration.
   * @param registeredBy - The social agent who registered the registration.
   * @param registeredWith - The application agent with which the registration is associated.
   * @param registeredAt - The date when the registration was made.
   * @param updatedAt - The date when the registration was last updated.
   * @returns An array of quads representing the registration information.
   */
  protected static newQuadsReg(
    id: string,
    registeredBy: SocialAgent,
    registeredWith: ApplicationAgent,
    registeredAt: Date,
    updatedAt: Date,
  ): Quad[] {
    const triple = (predicate: string, object: string | Date) =>
      createTriple(id, INTEROP + predicate, object);
    return [
      triple("registeredBy", registeredBy.getWebID()),
      triple("registeredWith", registeredWith.getWebID()),
      triple("registeredAt", registeredAt),
      triple("updatedAt", updatedAt),
    ];
  }

  /**
   * Gets the social agent who registered the registration.
   * @returns {SocialAgent} The social agent who registered the registration.
   * @throws {SAIViolationMissingTripleError} If the triple for the registeredBy property is missing.
   */
  get RegisteredBy(): SocialAgent {
    const webId = this.getObjectValueFromPredicate(INTEROP + "registeredBy");
    if (webId) return new SocialAgent(webId);

    throw new SAIViolationMissingTripleError(this, INTEROP + "registeredBy");
  }

  /**
   * Sets the agent who registered the registration.
   * 
   * @param agent The social agent who registered the registration.
   */
  async setRegisteredBy(agent: SocialAgent) {
    const predicate = INTEROP + "registeredBy";
    const quad = this.createTriple(predicate, agent.getWebID());
    await this.update(predicate, [quad]);
    await this.updateDate();
  }

  /**
   * Gets the application agent that this registration is associated with.
   * @returns {ApplicationAgent} The registered application agent.
   * @throws {SAIViolationMissingTripleError} If the registration does not have a "registeredWith" triple.
   */
  get RegisteredWith(): ApplicationAgent {
    const webId = this.getObjectValueFromPredicate(INTEROP + "registeredWith");
    if (webId) return new ApplicationAgent(webId);

    throw new SAIViolationMissingTripleError(this, INTEROP + "registeredWith");
  }

  /**
   * Sets the agent that the registration is associated with.
   * 
   * @param agent The application agent to set as the registered agent.
   */
  async setRegisteredWith(agent: ApplicationAgent) {
    const predicate = INTEROP + "registeredWith";
    const quad = this.createTriple(predicate, agent.getWebID());
    await this.update(predicate, [quad]);
    await this.updateDate();
  }

  /**
   * Gets the registered date of the registration.
   * @returns The registered date as a Date object.
   * @throws {SAIViolationMissingTripleError} If the registered date is missing.
   */
  get RegisteredAt(): Date {
    const date = this.getObjectValueFromPredicate(INTEROP + "registeredAt");
    if (date) return getDate(date);

    throw new SAIViolationMissingTripleError(this, INTEROP + "registeredAt");
  }

  /**
   * Sets the registered date for the registration.
   * 
   * @param date - The date to set as the registered date.
   */
  async setRegisteredAt(date: Date) {
    const predicate = INTEROP + "registeredAt";
    const quad = this.createTriple(predicate, date);
    await this.update(predicate, [quad]);
    await this.updateDate();
  }

  /**
   * Gets the updated date of the registration.
   * @returns The updated date as a Date object.
   * @throws {SAIViolationMissingTripleError} If the updated date is missing.
   */
  get UpdatedAt(): Date {
    const date = this.getObjectValueFromPredicate(INTEROP + "updatedAt");
    if (date) return getDate(date);

    throw new SAIViolationMissingTripleError(this, INTEROP + "updatedAt");
  }

  /**
   * Updates the date of the registration.
   * This method sets the "updatedAt" property of the registration to the current date.
   * @returns A promise that resolves when the update is complete.
   */
  protected async updateDate() {
    const predicate = INTEROP + "updatedAt";
    const quad = this.createTriple(predicate, new Date());
    await this.update(predicate, [quad]);
  }
}
