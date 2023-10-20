import { AgentRegistration } from "./agent-registration";

export class ApplicationtRegistration extends AgentRegistration {
    
    constructor(registeredBy: Agent, registeredWith: string, registeredAt : Date, updatedAt : Date, registeredAgent: string, hasAccessGrant: string) {
        super(registeredBy, registeredWith, registeredAt, updatedAt, registeredAgent, hasAccessGrant);
    }
}