import { Agent, ApplicationAgent, SocialAgent } from "../agent";

export class AccessAuthorization {
    grantedBy: SocialAgent;
    grantedWith: ApplicationAgent;
    grantedAt: Date;
    grantee: Agent;
    hasAccessNeedGroup: string;
    hasDataAuthorization: string;
    replaces: AccessAuthorization;
    id: string;
    constructor(
        id: string,
        grantedBy: SocialAgent,
        grantedWith: ApplicationAgent,
        grantedAt: Date,
        grantee: Agent,
        hasAccessNeedGroup: string, //Needs to Access Need Group class
        hasDataAuthorization: string, // Needs to be Data Authorization class
        replaces: AccessAuthorization
    ) {
        this.id = id;
        this.grantedBy = grantedBy;
        this.grantedWith = grantedWith;
        this.grantedAt = grantedAt;
        this.grantee = grantee;
        this.hasAccessNeedGroup = hasAccessNeedGroup;
        this.hasDataAuthorization = hasDataAuthorization;
        this.replaces = replaces;

    }
}