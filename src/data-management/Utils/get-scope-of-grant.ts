import { GrantScope } from "../data-model/authorization/grant-scope";

class InvalidGrantScope extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function getScopeOfGrant(scopeOfGrant: string): GrantScope {
  if (Object.values(GrantScope).includes(scopeOfGrant as GrantScope))
    return scopeOfGrant as GrantScope;

  throw new InvalidGrantScope("Could not infer grant scope " + scopeOfGrant);
}
