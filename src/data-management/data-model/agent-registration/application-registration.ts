import N3, { Prefixes, Store } from "n3";
import { ApplicationAgent, SocialAgent } from "../agent";
import { AgentRegistration } from "./agent-registration";
import { AccessGrant } from "../authorization/access/access-grant";
import { Fetch } from "../../../fetch";

const { DataFactory } = N3;
const { namedNode } = DataFactory;

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
      "ApplicationRegistration",
      fetch, dataset, prefixes
    );
  }

  static async new(
    id: string,
    fetch: Fetch,
    registeredBy: SocialAgent,
    registeredWith: ApplicationAgent,
    registeredAt: Date,
    updatedAt: Date,
    registeredAgent: SocialAgent,
    hasAccessGrant: AccessGrant[]
  ) {
    const agentReg = new ApplicationRegistration(id, fetch)
    
    const quads = super.newQuadsAgent(id, registeredBy, registeredWith, registeredAt, updatedAt, registeredAgent, hasAccessGrant);

    await agentReg.add(quads)

    return agentReg
  }
}
