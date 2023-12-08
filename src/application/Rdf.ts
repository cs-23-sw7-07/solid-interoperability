import { fetch } from "solid-auth-fetcher";
import N3 from "n3";
import { URL } from "url";
import { ISocialAgent } from "./SocialAgent";

export class Rdf {
  constructor(private quads: N3.Quad[]) {}

  get Quads() {
    return this.quads;
  }
}

export class ProfileDocument extends Rdf implements ISocialAgent {
  private pod: URL | undefined;
  private document: string | undefined;

  static async fetch(webId: URL) {
    const response = await fetch(webId.toString(), {
      headers: { "Content-Type": "text/turtle" },
    });
    const profile = await response.text();
    const pd = await this.parse(profile);
    pd.pod = await this.getPod(pd.WebId.toString());
    return pd;
  }

  static async parse(document: string) {
    const parser = new N3.Parser();
    const pd = new ProfileDocument(parser.parse(document));
    pd.document = document;
    return pd;
  }

  get Document(): string {
    if (this.document) return this.document;
    else
      throw new Error(
        "Profile document did not have its document property set. It may not have been created correctly.",
      );
  }

  static async getPod(webId: string) {
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

  get AuthorizationAgent() {
    const agentUrl = this.Quads.find(
      (x) =>
        x.predicate.value ==
        "http://www.w3.org/ns/solid/interop#hasAuthorizationAgent",
    )?.object.value;
    if (agentUrl == undefined) {
      throw Error(
        "The identity described by this profile document does not have any authorization agent.",
      );
    }
    return new URL(agentUrl);
  }

  get WebId() {
    const id = this.Quads.find(
      (x) =>
        x.object.value == "http://xmlns.com/foaf/0.1/Person" ||
        x.object.value == "http://www.w3.org/ns/solid/interop#Application",
    )?.subject.value;
    if (id == undefined) {
      throw new Error("Did not find WebId in profile document.");
    }
    return new URL(id);
  }

  get Pod(): URL {
    if (this.pod != undefined) {
      return this.pod;
    }
    throw new Error("Pod has not been set!");
  }
}
