import { AccessGrant } from "../access-authorization/access-grant";
import { Agent, ApplicationAgent, SocialAgent } from "../agent";

export abstract class AgentRegistration {
    id: string;
    registeredBy : SocialAgent;
    registeredWith : ApplicationAgent;
    registeredAt : Date;
    updatedAt : Date;
    registeredAgent : Agent;
    hasAccessGrant : AccessGrant;
    
    constructor(id: string, registeredBy: SocialAgent, registeredWith: ApplicationAgent, registeredAt : Date, updatedAt : Date, registeredAgent: Agent, hasAccessGrant: AccessGrant) {
        this.id = id;
        this.registeredBy = registeredBy;
        this.registeredWith = registeredWith;
        this.registeredAt = registeredAt;
        this.updatedAt = updatedAt;
        this.registeredAgent = registeredAgent;
        this.hasAccessGrant = hasAccessGrant;
    }
}



