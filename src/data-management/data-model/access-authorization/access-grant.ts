import { Agent, SocialAgent } from "../agent";
import { DataGrant } from "./data-grant";

export class AccessGrant {
    id: string;
    grantedBy: SocialAgent;
    grantedAt: Date;
    grantee: Agent;
    hasAccessNeedGroup: string;
    hasDataGrant: DataGrant[];

    constructor(
        id: string,
        grantedBy: SocialAgent,
        grantedAt: Date,
        grantee: Agent,
        hasAccessNeedGroup: string,
        hasDataGrant: DataGrant[]
    ) {
        this.id = id;
        this.grantedBy = grantedBy;
        this.grantedAt = grantedAt;
        this.grantee = grantee;
        this.hasAccessNeedGroup = hasAccessNeedGroup;
        this.hasDataGrant = hasDataGrant;
    }    
}