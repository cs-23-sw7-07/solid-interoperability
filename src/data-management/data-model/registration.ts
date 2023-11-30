import { Rdf, createTriple } from "./RDF/rdf";
import { ApplicationAgent, SocialAgent } from "./agent";
import { INTEROP } from "./namespace";
import { Fetch } from "../../fetch";
import { getDate } from "../Utils";
import { Prefixes, Quad, Store } from "n3";

export abstract class Registration extends Rdf {
  constructor(
    id: string,
    type: string,
    fetch: Fetch,
    dataset?: Store,
    prefixes?: Prefixes,
  ) {
    super(id, type, fetch, dataset, prefixes);
  }

  protected static newQuadsReg(
    id: string,
    registeredBy: SocialAgent,
    registeredWith: ApplicationAgent,
    registeredAt: Date,
    updatedAt: Date): Quad[] {
    const triple = (predicate: string, object: string | Date) => createTriple(id, INTEROP + predicate, object);
    const quads = [
      triple("registeredBy", registeredBy.webID),
      triple("registeredWith", registeredWith.webID),
      triple("registeredAt", registeredAt),
      triple("updatedAt", updatedAt)
    ]
    return quads;
  }


  get RegisteredBy(): SocialAgent {
    const webId = this.getObjectValueFromPredicate(INTEROP + "registeredBy")!;
    return new SocialAgent(webId)
  }

  async setRegisteredBy(agent: SocialAgent) {
    const predicate = INTEROP + "registeredBy";
    const quad = this.createTriple(predicate, agent.webID)
    await this.update(predicate, [quad])
    await this.updateDate()
  }

  get RegisteredWith(): ApplicationAgent {
    const webId = this.getObjectValueFromPredicate(INTEROP + "registeredWith")!;
    return new ApplicationAgent(webId)
  }

  async setRegisteredWith(agent: ApplicationAgent) {
    const predicate = INTEROP + "registeredWith";
    const quad = this.createTriple(predicate, agent.webID)
    await this.update(predicate, [quad])
    await this.updateDate()
  }

  get RegisteredAt(): Date {
    return getDate(this.getObjectValueFromPredicate(INTEROP + "registeredAt")!)
  }

  async setRegisteredAt(date: Date) {
    const predicate = INTEROP + "registeredAt";
    const quad = this.createDateTriple(predicate, date)
    await this.update(predicate, [quad])
    await this.updateDate()
  }

  get UpdatedAt(): Date {
    return getDate(this.getObjectValueFromPredicate(INTEROP + "updatedAt")!)
  }

  protected async updateDate() {
    const predicate = INTEROP + "updatedAt";
    const quad = this.createDateTriple(predicate, new Date())
    await this.update(predicate, [quad])
  }
}