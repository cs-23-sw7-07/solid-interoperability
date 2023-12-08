import {createTriple, Rdf} from "./RDF/rdf";
import {ApplicationAgent, SocialAgent} from "./agent";
import {INTEROP} from "./namespace";
import {Fetch} from "../../fetch";
import {getDate} from "../Utils";
import {Prefixes, Quad, Store} from "n3";
import {SAIViolationMissingTripleError} from "../../Errors";

export abstract class Registration extends Rdf {
  constructor(id: string, fetch: Fetch, dataset?: Store, prefixes?: Prefixes) {
    super(id, fetch, dataset, prefixes);
  }

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
      triple("registeredBy", registeredBy.webID),
      triple("registeredWith", registeredWith.webID),
      triple("registeredAt", registeredAt),
      triple("updatedAt", updatedAt),
    ];
  }

  get RegisteredBy(): SocialAgent {
    const webId = this.getObjectValueFromPredicate(INTEROP + "registeredBy");
    if (webId) return new SocialAgent(webId);

    throw new SAIViolationMissingTripleError(this, INTEROP + "registeredBy");
  }

  async setRegisteredBy(agent: SocialAgent) {
    const predicate = INTEROP + "registeredBy";
    const quad = this.createTriple(predicate, agent.webID);
    await this.update(predicate, [quad]);
    await this.updateDate();
  }

  get RegisteredWith(): ApplicationAgent {
    const webId = this.getObjectValueFromPredicate(INTEROP + "registeredWith");
    if (webId) return new ApplicationAgent(webId);

    throw new SAIViolationMissingTripleError(this, INTEROP + "registeredWith");
  }

  async setRegisteredWith(agent: ApplicationAgent) {
    const predicate = INTEROP + "registeredWith";
    const quad = this.createTriple(predicate, agent.webID);
    await this.update(predicate, [quad]);
    await this.updateDate();
  }

  get RegisteredAt(): Date {
    const date = this.getObjectValueFromPredicate(INTEROP + "registeredAt");
    if (date) return getDate(date);

    throw new SAIViolationMissingTripleError(this, INTEROP + "registeredAt");
  }

  async setRegisteredAt(date: Date) {
    const predicate = INTEROP + "registeredAt";
    const quad = this.createTriple(predicate, date);
    await this.update(predicate, [quad]);
    await this.updateDate();
  }

  get UpdatedAt(): Date {
    const date = this.getObjectValueFromPredicate(INTEROP + "updatedAt");
    if (date) return getDate(date);

    throw new SAIViolationMissingTripleError(this, INTEROP + "updatedAt");
  }

  protected async updateDate() {
    const predicate = INTEROP + "updatedAt";
    const quad = this.createTriple(predicate, new Date());
    await this.update(predicate, [quad]);
  }
}
