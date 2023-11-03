import { AccessNeed } from "./AccessNeed";

class AccessNeedGroup {
    id: string;
    hasAccessDescriptionSet: AccessDescriptionSet;
    accessNecessity: string; //interop:AccessRequired, interop:AccessOptional
    accessScenario: string; //interop:PersonalAccess, interop:SharedAccess
    authenticatesAs: string; //	interop:SocialAgent or interop:Application
    hasAccessNeed: AccessNeed;
    replaces: AccessNeedGroup;
    constructor(
        id: string,
        hasAccessDescriptionSet: AccessDescriptionSet,
        accessNecessity: string,
        accessScenario: string,
        authenticatesAs: string,
        hasAccessNeed: AccessNeed,
        replaces: AccessNeedGroup
    ) {
        this.id = id;
        this.hasAccessDescriptionSet = hasAccessDescriptionSet;
        this.accessNecessity = accessNecessity;
        this.accessScenario = accessScenario;
        this.authenticatesAs = authenticatesAs;
        this.hasAccessNeed = hasAccessNeed;
        this.replaces = replaces;
    }
}
