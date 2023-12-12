import { INTEROP } from "../namespace";
import { ProfileDocument } from "./profile-document";
import N3 from "n3";
import {URL} from "url";
import {Fetch} from "../../../fetch";

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

export async function getPod(webId: string, fetch: Fetch) {
  let pd;
  try {
    pd = await fetch(webId, { headers: { Accept: "text/turtle" } });
  } catch (e) {
    console.log(e);
    throw e;
  }

  for (const link of pd.headers.get("link")!.split(",")) {
    if (
        link.includes("http://www.w3.org/ns/solid/terms#storageDescription")
    ) {
      const podUrl = await fetch(link.split(";")[0].slice(2, -1), {
        headers: { Accept: "text/turtle" },
      });

      const parser = new N3.Parser();
      const quads = parser.parse(await podUrl.text());
      for (const quad of quads) {
        if (quad.object.id == "http://www.w3.org/ns/pim/space#Storage") {
          return new URL(quad.subject.id);
        }
      }
      throw new Error("Could not find pod URL!");
    }
  }
  throw new Error("No storage pod found!");
}