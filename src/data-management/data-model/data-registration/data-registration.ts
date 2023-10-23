import { SocialAgent } from "../agent";

export class DataRegistration {
    registeredBy: SocialAgent;
    registeredWith: string;
    registeredAt: Date;
    updatedAt: Date;
    registeredShapeTree: string;

    constructor(
        registeredBy: SocialAgent,
        registeredWith: string,
        registeredAt: Date,
        updatedAt: Date,
        registeredShapeTree: string
    ) {
        this.registeredBy = registeredBy;
        this.registeredWith = registeredWith;
        this.registeredAt = registeredAt;
        this.updatedAt = updatedAt;
        this.registeredShapeTree = registeredShapeTree;
    }
}
