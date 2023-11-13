import { AccessNeed } from "./AccessNeed";
import { AccessDescriptionSet } from "./AccessDescriptionSet";

/**
 * A class which has the fields to conform to the `Access Need Group` graph defined in the Solid interoperability specification.
 * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#access-need-group
 */
export class AccessNeedGroup {
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
    replaces: AccessNeedGroup,
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
