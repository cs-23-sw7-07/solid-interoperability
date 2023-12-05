import {AccessMode} from "../data-model/authorization/access/access-mode";
import {InvalidAccessMode} from "../../Errors/InvalidAccessMode";

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
      throw new InvalidAccessMode("Could not infer access mode " + accessMode);
    }
  }
  return accessModeEnum!;
}

export function accessModeFromEnum(accessModeEnum: AccessMode): string {
  const solidAcl: string = "http://www.w3.org/ns/auth/acl#";

  switch (accessModeEnum) {
    case AccessMode.Read: {
      return solidAcl + "Read";
    }
    case AccessMode.Write: {
      return solidAcl + "Write";
    }
    case AccessMode.Update: {
      return solidAcl + "Update";
    }
    case AccessMode.Create: {
      return solidAcl + "Create";
    }
    case AccessMode.Delete: {
      return solidAcl + "Delete";
    }
    case AccessMode.Append: {
      return solidAcl + "Append";
    }
    default: {
      throw new InvalidAccessMode("Invalid access mode enum: " + accessModeEnum);
    }
  }
}
