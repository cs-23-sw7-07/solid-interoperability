import { INTEROP } from "../namespace";
import { ProfileDocument } from "./profile-document";

export function isApplicationAgent(profile: ProfileDocument): boolean {
  const types = profile.getTypeOfSubject();
  if (types) return types.includes(INTEROP + "Application");
  throw new Error("The subject in the profile document has no agent type");
}

export function isSocialAgent(profile: ProfileDocument): boolean {
  return !isApplicationAgent(profile);
}
