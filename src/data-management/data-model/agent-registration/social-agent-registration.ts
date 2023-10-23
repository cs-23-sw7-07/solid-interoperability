import { AccessGrant } from "../access-authorization/access-grant";
import { ApplicationAgent, SocialAgent } from "../agent";
import { AgentRegistration } from "./agent-registration";

export class SocialAgentRegistration extends AgentRegistration {
    reciprocalRegistration: string;

    constructor(
        id: string,
        registeredBy: SocialAgent,
        registeredWith: ApplicationAgent,
        registeredAt: Date,
        updatedAt: Date,
        registeredAgent: SocialAgent,
        hasAccessGrant: AccessGrant,
        reciprocalRegistration: string) {
        super(id, registeredBy, registeredWith, registeredAt, updatedAt, registeredAgent, hasAccessGrant);
        this.reciprocalRegistration = reciprocalRegistration;
    }
}