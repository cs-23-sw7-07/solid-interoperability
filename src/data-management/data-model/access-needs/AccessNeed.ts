import { AccessMode } from "../authorization/access-mode";
import { AccessNecessity } from "./AccessNecessity";

/**
 * A class which has the fields to conform to the `Access Need` graph defined in the Solid interoperability specification.
 * Definition of the graph: https://solid.github.io/data-interoperability-panel/specification/#needs-access-need
 */
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
    inheritsFromNeed: AccessNeed,
  ) {
    this.registeredShapeTree = registeredShapeTree;
    this.acessMode = acessMode;
    this.creatorAccessMode = creatorAccessMode;
    this.accessNecessity = accessNecessity;
    this.hasDataInstance = hasDataInstance;
    this.inheritsFromNeed = inheritsFromNeed;
  }
}
