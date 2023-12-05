import {GrantScope} from "../data-model/authorization/grant-scope";

class InvalidGrantScope extends Error {
  constructor(message: string) {
    super(message);
  }
}

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
    default: {
      throw new InvalidGrantScope("Could not infer grant scope " + scopeOfAuth);
    }
  }
  return scopeOfAuthEnum!;
}

export function scopeOfAuthFromEnum(scopeOfAuthEnum: GrantScope): string {
  const solidInterop: string = "http://www.w3.org/ns/solid/interop#";

  switch (scopeOfAuthEnum) {
    case GrantScope.All: {
      return solidInterop + "All";
    }
    case GrantScope.AllFromAgent: {
      return solidInterop + "AllFromAgent";
    }
    case GrantScope.AllFromRegistry: {
      return solidInterop + "AllFromRegistry";
    }
    case GrantScope.SelectedFromRegistry: {
      return solidInterop + "SelectedFromRegistry";
    }
    case GrantScope.Inherited: {
      return solidInterop + "Inherited";
    }
    default: {
      throw new InvalidGrantScope("Invalid grant scope enum: " + scopeOfAuthEnum);
    }
  }
}

