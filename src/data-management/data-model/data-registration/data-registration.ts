class DataRegistration {
    registeredBy: Agent;
    registeredWith: string;
    registeredAt: Date;
    updatedAt: Date;
    registeredShapeTree: string;

    constructor(
        registeredBy: Agent,
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
