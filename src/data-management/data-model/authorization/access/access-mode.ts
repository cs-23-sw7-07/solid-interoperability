import {ACL} from "../../namespace";

/**
 * These access modes are all the different modes which the Solid interoperability specification defines on Data Grant and Data Authorization.
 * Both can be found here respectively: https://solid.github.io/data-interoperability-panel/specification/#data-grant, https://solid.github.io/data-interoperability-panel/specification/#data-authorization.
 */
export enum AccessMode {
  Read = ACL + "Read",
  Write = ACL + "Write",
  Update = ACL + "Update",
  Create = ACL + "Create",
  Delete = ACL + "Delete",
  Append = ACL + "Append",
}
