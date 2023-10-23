import { Agent, SocialAgent } from "../agent";
import { DataRegistration } from "../data-registration/data-registration";

enum AccessMode {
    Read = "acl:Read",
    Write = "acl:Write",
    Update = "acl:Update",
    Create = "acl:Create",
    Delete = "acl:Delete",
    Append = "acl:Append"
}

enum GrantScope {
    All = "interop:All",
    AllFromAgent = "interop:AllFromAgent",
    AllFromRegistry = "interop:AllFromRegistry",
    SelectedFromRegistry = "interop:SelectedFromRegistry",
    Inherited = "interop:Inherited"
}

export class DataGrant {
    dataOwner: SocialAgent;
    grantee: Agent;
    registeredShapeTree: string; // TODO: NEED TO FINDOUT
    hasDataRegistration: DataRegistration;
    accessMode: AccessMode[];
    creatorAccessMode?: AccessMode[];
    scopeOfGrant: GrantScope;
    satisfiesAccessNeed: string; // TODO: NEED TO FINDOUT
    hasDataInstance: string;
    inheritsFromGrant?: DataGrant;

    constructor(
        dataOwner: SocialAgent,
        grantee: Agent,
        registeredShapeTree: string,
        hasDataRegistration: DataRegistration,
        accessMode: AccessMode[],
        scopeOfGrant: GrantScope,
        satisfiesAccessNeed: string,
        hasDataInstance: string,
        creatorAccessMode?: AccessMode[],
        inheritsFromGrant?: DataGrant
    ) {
        this.dataOwner = dataOwner;
        this.grantee = grantee;
        this.registeredShapeTree = registeredShapeTree;
        this.hasDataRegistration = hasDataRegistration;
        this.accessMode = accessMode;
        this.scopeOfGrant = scopeOfGrant;
        this.satisfiesAccessNeed = satisfiesAccessNeed;
        this.hasDataInstance = hasDataInstance;
        if (creatorAccessMode) this.creatorAccessMode = creatorAccessMode;
        if (inheritsFromGrant) this.inheritsFromGrant = inheritsFromGrant;
    }
}

