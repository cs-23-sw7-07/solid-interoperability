import { AccessGrant } from "../access-authorization/access-grant";
import { SocialAgent } from "../agent";

export abstract class AgentRegistration {
    registeredBy : SocialAgent;
    registeredWith : string;
    registeredAt : Date;
    updatedAt : Date;
    registeredAgent : string;
    hasAccessGrant : AccessGrant;
    
    constructor(registeredBy: SocialAgent, registeredWith: string, registeredAt : Date, updatedAt : Date, registeredAgent: string, hasAccessGrant: AccessGrant) {
        this.registeredBy = registeredBy;
        this.registeredWith = registeredWith;
        this.registeredAt = registeredAt;
        this.updatedAt = updatedAt;
        this.registeredAgent = registeredAgent;
        this.hasAccessGrant = hasAccessGrant;
    }
}



