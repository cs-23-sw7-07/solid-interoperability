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

export enum GrantScope {
    All = "interop:All",
    AllFromAgent = "interop:AllFromAgent",
    AllFromRegistry = "interop:AllFromRegistry",
    SelectedFromRegistry = "interop:SelectedFromRegistry",
    Inherited = "interop:Inherited"
}

export class DataGrant {
    id: string;
    storedAt: string;
    agentRegistrationIRI: string;
    dataOwner: SocialAgent;
    grantee: Agent;
    registeredShapeTree: string; // TODO: NEED TO FINDOUT
    hasDataRegistration: DataRegistration;
    accessMode: AccessMode[];
    creatorAccessMode?: AccessMode[];
    scopeOfGrant: GrantScope;
    satisfiesAccessNeed: string; // TODO: NEED TO FINDOUT
    hasDataInstanceIRIs?: string[];
    inheritsFromGrant?: DataGrant;

    constructor(
        id: string,
        storedAt: string,
        agentRegistrationIRI: string,
        dataOwner: SocialAgent,
        grantee: Agent,
        registeredShapeTree: string,
        hasDataRegistration: DataRegistration,
        accessMode: AccessMode[],
        scopeOfGrant: GrantScope,
        satisfiesAccessNeed: string,
        hasDataInstanceIRIs?: string[],
        creatorAccessMode?: AccessMode[],
        inheritsFromGrant?: DataGrant
    ) {
        this.id = id;
        this.storedAt = storedAt;
        this.agentRegistrationIRI = agentRegistrationIRI;
        this.dataOwner = dataOwner;
        this.grantee = grantee;
        this.registeredShapeTree = registeredShapeTree;
        this.hasDataRegistration = hasDataRegistration;
        this.accessMode = accessMode;
        this.scopeOfGrant = scopeOfGrant;
        this.satisfiesAccessNeed = satisfiesAccessNeed;
        this.hasDataInstanceIRIs = hasDataInstanceIRIs;
        if (creatorAccessMode) this.creatorAccessMode = creatorAccessMode;
        if (inheritsFromGrant) this.inheritsFromGrant = inheritsFromGrant;
    }
}

