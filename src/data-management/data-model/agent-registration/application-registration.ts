import { AccessGrant } from "../access-authorization/access-grant";
import { ApplicationAgent, SocialAgent } from "../agent";
import { AgentRegistration } from "./agent-registration";

export class ApplicationtRegistration extends AgentRegistration {
    constructor(
        id: string,
        registeredBy: SocialAgent,
        registeredWith: ApplicationAgent,
        registeredAt : Date,
        updatedAt : Date,
        registeredAgent: ApplicationAgent,
        hasAccessGrant: AccessGrant) {
        super(id, registeredBy, registeredWith, registeredAt, updatedAt, registeredAgent, hasAccessGrant);
    }
}