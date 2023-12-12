import { INTEROP } from "../namespace";

/**
 * This enum is used for the fields, `scopeOfGrant` to define the scope of each grant from the Solid interoperability specification.
 */
export enum GrantScope {
  All = INTEROP + "All",
  AllFromAgent = INTEROP + "AllFromAgent",
  AllFromRegistry = INTEROP + "AllFromRegistry",
  SelectedFromRegistry = INTEROP + "SelectedFromRegistry",
  Inherited = INTEROP + "Inherited",
}
