import { Agent, SocialAgent } from "../agent";

export class DataRegistration {
    id: string;
    storedAtFolder: string;
    registeredBy: SocialAgent;
    registeredWith: Agent;
    registeredAt: Date;
    updatedAt: Date;
    registeredShapeTree: string;

    constructor(
        id: string,
        storedAtFolder: string,
        registeredBy: SocialAgent,
        registeredWith: Agent,
        registeredAt: Date,
        updatedAt: Date,
        registeredShapeTree: string
    ) {
        this.id = id;
        this.storedAtFolder = storedAtFolder;
        this.registeredBy = registeredBy;
        this.registeredWith = registeredWith;
        this.registeredAt = registeredAt;
        this.updatedAt = updatedAt;
        this.registeredShapeTree = registeredShapeTree;
    }
}
