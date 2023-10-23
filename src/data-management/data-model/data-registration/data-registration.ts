import { SocialAgent } from "../agent";

export class DataRegistration {
    id: string;
    registeredBy: SocialAgent;
    registeredWith: string;
    registeredAt: Date;
    updatedAt: Date;
    registeredShapeTree: string;

    constructor(
        id: string,
        registeredBy: SocialAgent,
        registeredWith: string,
        registeredAt: Date,
        updatedAt: Date,
        registeredShapeTree: string
    ) {
        this.id = id;
        this.registeredBy = registeredBy;
        this.registeredWith = registeredWith;
        this.registeredAt = registeredAt;
        this.updatedAt = updatedAt;
        this.registeredShapeTree = registeredShapeTree;
    }

}
