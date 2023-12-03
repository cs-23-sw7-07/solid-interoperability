import { Prefixes, Store } from "n3";
import {Agent, ApplicationAgent, SocialAgent} from "../agent";
import { AgentRegistration } from "./agent-registration";
import { AccessGrant } from "../authorization/access/access-grant";
import { Fetch } from "../../../fetch";
import {createTriple} from "../RDF/rdf";
import {INTEROP} from "../namespace";
import { SAIViolationMissingTripleError } from "../../../Errors";

/**
 * A class which has the fields to conform to the `Application Agent Registration` graph defined in the Solid interoperability specification.
 * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#application-registration
 */
export class ApplicationRegistration
  extends AgentRegistration
{
  constructor(
    id: string,
    fetch: Fetch, 
    dataset?: Store,
    prefixes?: Prefixes,
  ) {
    super(
      id,
      fetch, dataset, prefixes
    );
  }

  static async new(
    id: string,
    fetch: Fetch,
    registeredBy: SocialAgent,
    registeredWith: ApplicationAgent,
    registeredAgent: ApplicationAgent,
    hasAccessGrant: AccessGrant[]
  ) {
    const agentReg = new ApplicationRegistration(id, fetch)
    const triple = (predicate: string, object: string | Date) => createTriple(id, INTEROP + predicate, object);

    const quads = super.newQuadsAgent(id, registeredBy, registeredWith, new Date(), new Date(), hasAccessGrant);
    quads.push(triple("registeredAgent", registeredAgent.webID))
    await agentReg.add(quads)

    return agentReg
  }

  get RegisteredAgent(): ApplicationAgent {
    const webId = this.getObjectValueFromPredicate(INTEROP + "registeredAgent");
    if (!webId)
      throw new SAIViolationMissingTripleError(this, "registeredAgent");

    return new ApplicationAgent(webId);
  }

  set RegisteredAgent(agent: ApplicationAgent) {
    const predicate = INTEROP + "registeredAgent"
    const quad = this.createTriple(predicate, agent.webID)
    this.update(predicate, [quad])
  }
}
