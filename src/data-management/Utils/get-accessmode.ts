import { AccessMode } from "../data-model/authorization/access-mode";

export function getAccessmode(accessMode: string): AccessMode {
  let accessModeEnum: AccessMode;
  const solidAcl: string = "http://www.w3.org/ns/auth/acl#";

  switch (accessMode) {
    case solidAcl + "Read": {
      accessModeEnum = AccessMode.Read;
      break;
    }
    case solidAcl + "Write": {
      accessModeEnum = AccessMode.Write;
      break;
    }
    case solidAcl + "Update": {
      accessModeEnum = AccessMode.Update;
      break;
    }
    case solidAcl + "Create": {
      accessModeEnum = AccessMode.Create;
      break;
    }
    case solidAcl + "Delete": {
      accessModeEnum = AccessMode.Delete;
      break;
    }
    case solidAcl + "Append": {
      accessModeEnum = AccessMode.Append;
      break;
    }
    default: {
      throw new Error("Could not infer access mode");
    }
  }
  return accessModeEnum!;
}
