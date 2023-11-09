import { GrantScope } from "../data-model/authorization/grant-scope";

export function getScopeOfAuth(scopeOfAuth: string): GrantScope {
  let scopeOfAuthEnum: GrantScope;
  switch (scopeOfAuth) {
    case "http://www.w3.org/ns/solid/interop#All": {
      scopeOfAuthEnum = GrantScope.All;
      break;
    }
    case "http://www.w3.org/ns/solid/interop#AllFromAgent": {
      scopeOfAuthEnum = GrantScope.AllFromAgent;
      break;
    }
    case "http://www.w3.org/ns/solid/interop#AllFromRegistry": {
      scopeOfAuthEnum = GrantScope.AllFromRegistry;
      break;
    }
    case "http://www.w3.org/ns/solid/interop#SelectedFromRegistry": {
      scopeOfAuthEnum = GrantScope.SelectedFromRegistry;
      break;
    }
    case "http://www.w3.org/ns/solid/interop#Inherited": {
      scopeOfAuthEnum = GrantScope.Inherited;
      break;
    }
  }
  return scopeOfAuthEnum!;
}
