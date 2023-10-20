import { AgentRegistration } from "./agent-registration";

export class SocialAgentRegistration extends AgentRegistration {
    reciprocalRegistration : string;
    
    constructor(registeredBy: Agent, registeredWith: string, registeredAt : Date, updatedAt : Date, registeredAgent: string, hasAccessGrant: string, reciprocalRegistration : string) {
        super(registeredBy, registeredWith, registeredAt, updatedAt, registeredAgent, hasAccessGrant);
        this.reciprocalRegistration = reciprocalRegistration;
    }
}