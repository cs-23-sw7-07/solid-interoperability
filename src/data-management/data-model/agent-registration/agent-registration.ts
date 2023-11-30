import {Prefixes, Quad, Store} from "n3";
import { Agent, ApplicationAgent, SocialAgent } from "../agent";
import { AccessGrant } from "../authorization/access/access-grant";
import { Registration } from "../registration";
import { Fetch } from "../../../fetch";
import {fetch} from "solid-auth-fetcher";
import {INTEROP} from "../namespace";
import {createTriple, getResource} from "../RDF/rdf";

export abstract class AgentRegistration extends Registration {
  /**
   * An abstract class which is used polymophicly where functions which both a `Social Agent Registration` or `Application Agent Resitration` can perform.
   * Has the fields which both the agent types share.
   */
  constructor(
    id: string,
    type: string,
    fetch: Fetch, 
    dataset?: Store,
    prefixes?: Prefixes,
  ) {
    super(
      id,
      type,
      fetch, dataset, prefixes
    );
  }

  protected static newQuadsAgent(
    id: string, 
    registeredBy: SocialAgent,
    registeredWith: ApplicationAgent,
    registeredAt: Date,
    updatedAt: Date,
    registeredAgent: SocialAgent,
    hasAccessGrant: AccessGrant[]): Quad[] {
    const triple = (predicate: string, object: string | Date) => createTriple(id, INTEROP + predicate, object);
    const quads = super.newQuadsReg(id, registeredBy, registeredWith, registeredAt, updatedAt)
    quads.push(triple("registeredAgent", registeredAgent.webID))
    
    for (const grant of hasAccessGrant) {
      quads.push(triple("hasAccessGrant", grant.uri))
    }
    return quads;
  }

  async getHasAccessGrants(): Promise<AccessGrant[]> {
    const grantIRIs = this.getObjectValuesFromPredicate(INTEROP + "hasAccessGrant");
    if (!grantIRIs) return [];

    let grants: AccessGrant[] = [];
    for (const uri of grantIRIs) {
      grants.push(await getResource(AccessGrant, fetch, uri));
    }

    return grants;
  }

  async AddAccessGrant(value: AccessGrant) {
    const predicate = INTEROP + "hasAccessGrant";
    const quad = this.createTriple(predicate, value.uri)
    await this.add([quad])
    await this.updateDate()
  }

  get RegisteredAgent(): Agent {
    const webId = this.getObjectValueFromPredicate(INTEROP + "registeredAgent")!;
    return new ApplicationAgent(webId);
  }

  set RegisteredAgent(agent: Agent) {
    const predicate = INTEROP + "registeredAgent"
    const quad = this.createTriple(predicate, agent.webID)
    this.update(predicate, [quad])
  }
}
