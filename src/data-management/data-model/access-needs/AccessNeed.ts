import { AccessMode } from "../authorization/access-mode";

export class AccessNeed {
    registeredShapeTree: string;
    acessMode: AccessMode;
    creatorAccessMode: AccessMode;
    accessNecessity: AccessNecessity;
    hasDataInstance: string; /*A Data Instance is a unique, 
    stored instance of data in a Data Registration that conforms to it’s 
    interop:registeredShapeTree. */
    inheritsFromNeed: AccessNeed;
    constructor(
        registeredShapeTree: string,
        acessMode: AccessMode,
        creatorAccessMode: AccessMode,
        accessNecessity: AccessNecessity,
        hasDataInstance: string,
        inheritsFromNeed: AccessNeed
    ) {
        this.registeredShapeTree = registeredShapeTree;
        this.acessMode = acessMode;
        this.creatorAccessMode = creatorAccessMode;
        this.accessNecessity = accessNecessity;
        this.hasDataInstance = hasDataInstance;
        this.inheritsFromNeed = inheritsFromNeed;
    }
}
