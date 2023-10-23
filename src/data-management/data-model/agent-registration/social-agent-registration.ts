import { AccessGrant } from "../access-authorization/access-grant";
import { SocialAgent } from "../agent";
import { AgentRegistration } from "./agent-registration";

export class SocialAgentRegistration extends AgentRegistration {
    reciprocalRegistration : string;
    
    constructor(registeredBy: SocialAgent, registeredWith: string, registeredAt : Date, updatedAt : Date, registeredAgent: string, hasAccessGrant: AccessGrant, reciprocalRegistration : string) {
        super(registeredBy, registeredWith, registeredAt, updatedAt, registeredAgent, hasAccessGrant);
        this.reciprocalRegistration = reciprocalRegistration;
    }
}