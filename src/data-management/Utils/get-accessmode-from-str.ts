import { AccessMode } from "../data-model/authorization/access-mode";

export function getAccessmodeFromStr(accessMode: string): AccessMode {
  let accessModeEnum: AccessMode;
  switch (accessMode) {
    case "http://www.w3.org/ns/auth/acl#Read": {
      accessModeEnum = AccessMode.Read;
      break;
    }
    case "http://www.w3.org/ns/auth/acl#Write": {
      accessModeEnum = AccessMode.Write;
      break;
    }
    case "http://www.w3.org/ns/auth/acl#Update": {
      accessModeEnum = AccessMode.Update;
      break;
    }
    case "http://www.w3.org/ns/auth/acl#Create": {
      accessModeEnum = AccessMode.Create;
      break;
    }
    case "http://www.w3.org/ns/auth/acl#Delete": {
      accessModeEnum = AccessMode.Delete;
      break;
    }
    case "http://www.w3.org/ns/auth/acl#Append": {
      accessModeEnum = AccessMode.Append;
      break;
    }
    default: {
      throw new Error("Could not infer access mode")
    }
  }
  return accessModeEnum!;
}
