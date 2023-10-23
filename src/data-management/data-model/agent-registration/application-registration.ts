import { AccessGrant } from "../access-authorization/access-grant";
import { SocialAgent } from "../agent";
import { AgentRegistration } from "./agent-registration";

export class ApplicationtRegistration extends AgentRegistration {
    constructor(registeredBy: SocialAgent, registeredWith: string, registeredAt : Date, updatedAt : Date, registeredAgent: string, hasAccessGrant: AccessGrant) {
        super(registeredBy, registeredWith, registeredAt, updatedAt, registeredAgent, hasAccessGrant);
    }
}