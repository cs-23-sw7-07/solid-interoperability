import { Prefixes, Store } from "n3";
import { AgentRegistration } from "./agent-registration";
import { Fetch } from "../../../fetch";
import { INTEROP } from "../namespace";
import {Agent, ApplicationAgent, SocialAgent} from "../agent";
import { AccessGrant } from "../authorization/access/access-grant";

/**
 * A class which has the fields to conform to the `Social Agent Registration` graph defined in the Solid interoperability specification.
 * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#social-agent-registration
 */
export class SocialAgentRegistration extends AgentRegistration {
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
    registeredAgent: SocialAgent,
    hasAccessGrant: AccessGrant[],
    reciprocalRegistration: string,
  ) {
    const agentReg = new SocialAgentRegistration(id, fetch)
    const triple = (predicate: string, object: string) => agentReg.createTriple(INTEROP + predicate, object);
    
    const quads = super.newQuadsAgent(id, registeredBy, registeredWith, new Date(), new Date(), hasAccessGrant);
    quads.push(triple("registeredAgent", registeredAgent.webID), triple("reciprocalRegistration", reciprocalRegistration))

    await agentReg.add(quads)

    return agentReg
  }

  get RegisteredAgent(): SocialAgent {
    const webId = this.getObjectValueFromPredicate(INTEROP + "registeredAgent")!;
    return new SocialAgent(webId);
  }

  set RegisteredAgent(agent: SocialAgent) {
    const predicate = INTEROP + "registeredAgent"
    const quad = this.createTriple(predicate, agent.webID)
    this.update(predicate, [quad])
  }

  get ReciprocalRegistration(): string {
    return this.getObjectValueFromPredicate(INTEROP + "reciprocalRegistration")!;
  }
}
