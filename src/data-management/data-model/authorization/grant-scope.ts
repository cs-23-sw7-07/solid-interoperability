/**
 * This enum is used for the fields, `scopeOfGrant` to define the scope of each grant from the Solid interoperability specification.
 */
export enum GrantScope {
  All = "interop:All",
  AllFromAgent = "interop:AllFromAgent",
  AllFromRegistry = "interop:AllFromRegistry",
  SelectedFromRegistry = "interop:SelectedFromRegistry",
  Inherited = "interop:Inherited",
}
