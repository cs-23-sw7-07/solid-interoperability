import { AccessMode } from "../data-model/authorization/access/access-mode";
import { InvalidAccessMode } from "../../Errors/InvalidAccessMode";

/**
 * Converts a string representation of an access mode to its corresponding AccessMode enum value.
 * @param accessMode - The string representation of the access mode.
 * @returns The AccessMode enum value.
 * @throws InvalidAccessMode - If the access mode cannot be inferred from the provided string.
 */
export function getAccessmode(accessMode: string): AccessMode {
  if (Object.values(AccessMode).includes(accessMode as AccessMode))
    return (accessMode as AccessMode);
  throw new InvalidAccessMode(
      "Invalid access mode: " + accessMode,
  );
}