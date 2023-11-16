import { GrantScope } from "../data-model/authorization/grant-scope";

export function getScopeOfAuth(scopeOfAuth: string): GrantScope {
  let scopeOfAuthEnum: GrantScope;
  const solidInterop: string = "http://www.w3.org/ns/solid/interop#";

  switch (scopeOfAuth) {
    case solidInterop + "All": {
      scopeOfAuthEnum = GrantScope.All;
      break;
    }
    case solidInterop + "AllFromAgent": {
      scopeOfAuthEnum = GrantScope.AllFromAgent;
      break;
    }
    case solidInterop + "AllFromRegistry": {
      scopeOfAuthEnum = GrantScope.AllFromRegistry;
      break;
    }
    case solidInterop + "SelectedFromRegistry": {
      scopeOfAuthEnum = GrantScope.SelectedFromRegistry;
      break;
    }
    case solidInterop + "Inherited": {
      scopeOfAuthEnum = GrantScope.Inherited;
      break;
    }
  }
  return scopeOfAuthEnum!;
}
