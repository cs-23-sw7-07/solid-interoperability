import {INTEROP} from "../namespace";
import {ProfileDocument} from "./profile-document";

/**
 * Checks if the given profile document represents an application agent.
 * @param profile The profile document to check.
 * @returns True if the profile document represents an application agent, false otherwise.
 * @throws {Error} if the subject in the profile document has no agent type.
 */
export function isApplicationAgent(profile: ProfileDocument): boolean {
  const types = profile.getTypeOfSubject();
  if (types) return types.includes(INTEROP + "Application");
  throw new Error("The subject in the profile document has no agent type");
}

/**
 * Checks if the given profile is a social agent.
 * @param profile The profile document to check.
 * @returns True if the profile is a social agent, false otherwise.
 */
export function isSocialAgent(profile: ProfileDocument): boolean {
  return !isApplicationAgent(profile);
}
