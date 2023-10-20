class AccessGrant {
    grantedBy: Agent;
    grantedAt: Date;
    grantee: Agent;
    hasAccessNeedGroup: string;
    hasDataGrant: DataGrant[];

    constructor(
        grantedBy: Agent,
        grantedAt: Date,
        grantee: Agent,
        hasAccessNeedGroup: string,
        hasDataGrant: DataGrant[]
    ) {
        this.grantedBy = grantedBy;
        this.grantedAt = grantedAt;
        this.grantee = grantee;
        this.hasAccessNeedGroup = hasAccessNeedGroup;
        this.hasDataGrant = hasDataGrant;
    }
}