export abstract class AgentRegistration {
    registeredBy : Agent;
    registeredWith : string;
    registeredAt : Date;
    updatedAt : Date;
    registeredAgent : string;
    hasAccessGrant : AccessGrant;
    
    constructor(registeredBy: Agent, registeredWith: string, registeredAt : Date, updatedAt : Date, registeredAgent: string, hasAccessGrant: string) {
        this.registeredBy = registeredBy;
        this.registeredWith = registeredWith;
        this.registeredAt = registeredAt;
        this.updatedAt = updatedAt;
        this.registeredAgent = registeredAgent;
        this.hasAccessGrant = hasAccessGrant
    }
}



