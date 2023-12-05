import { NotImplementedYet } from "../Errors/NotImplementedYet";
import { URL } from "url";
import { DataInstance } from "./SolidDataInstance";
import { ProfileDocument } from "./Rdf";
import { fetch } from "solid-auth-fetcher";
import N3 from "n3";
import { DataRegistration } from "../data-management/data-model/data-registration/data-registration";
import { readableToString } from "@solid/community-server";
import { RdfFactory } from "../data-management/data-model/factory/rdfFactory";
import { ApplicationRegistration } from "../data-management/data-model/agent-registration/application-registration";

export interface IAuthorization {
  readonly socialAgent: ProfileDocument;
  store(instance: N3.Quad[], dataRegistration: URL): Promise<void>;
  getApplicationRegistration(): Promise<ApplicationRegistration>;
  get DataInstances(): DataInstance<unknown>[];
}

export class Authorization implements IAuthorization {
  constructor(readonly socialAgent: ProfileDocument) {}

  get WebId() {
    return this.socialAgent.WebId;
  }

  private applicationRegistration: ApplicationRegistration | undefined;
  async getApplicationRegistration(): Promise<ApplicationRegistration> {
    if (this.applicationRegistration != undefined) {
      return this.applicationRegistration;
    }
    const url = `${this.socialAgent.AuthorizationAgent}wants-access`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "text/turtle",
      },
    });
    const str = await res.text();

    const parser = new N3.Parser();
    //return parser.parse(str)
    //@ts-ignore
    return new ApplicationRegistration();
  }

  async getDataGrant(type: URL) {
    const applicationRegistration = await this.getApplicationRegistration();
  }

  async authFetch(
    url: RequestInfo,
    init?: RequestInit | undefined,
  ): Promise<Response> {
    // Notice: Auth has not been implemented.
    return fetch(url, init);
  }

  get DataInstances(): DataInstance<unknown>[] {
    throw new NotImplementedYet();
  }

  async store(instance: N3.Quad[], dataRegistration: URL) {
    const url = dataRegistration.toString();
    //const registration = this.service.getRegistry(typeof instance.data);
    const writer = new N3.Writer();
    writer.addQuads(instance);
    writer.end(async (error, result) => {
      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "text/turtle" },
        body: result,
      });
    });
  }

  async retrieve(registry: URL): Promise<N3.Quad[]> {
    // Should return the quads from a specific file within a data registry
    const response = await fetch(registry.toString(), {
      headers: { "Content-Type": "text/turtle" },
    });

    if (!response.ok) {
      throw new Error(
        `Bad response received: status code: ${response.status}, status message: ${response.statusText}`,
      );
    }

    const parser = new N3.Parser();
    return parser.parse(await response.text());
  }

  async listDataRegistries(registry: URL): Promise<string[]> {
    // Should return all URLs to files from a specific data registry
    const response = await fetch(registry.toString() + ".meta", {
      headers: { "Content-Type": "text/turtle" },
    });

    if (!response.ok) {
      throw new Error(
        `Bad response received: status code: ${response.status}, status message: ${response.statusText}`,
      );
    }

    const text = await response.text();
    const parser = new N3.Parser();
    let result: string[] = [];
    for (const quad of parser.parse(text)) {
      if (quad.predicate.id == "http://www.w3.org/ns/ldp#contains") {
        if (
          quad.object.id != "http://localhost:3000/weed/README" &&
          quad.object.id != "http://localhost:3000/weed/profile/"
        ) {
          if (quad.object.id.endsWith("/")) {
            result = result.concat(
              await this.listDataRegistries(new URL(quad.object.id)),
            );
          } else {
            result.push(quad.object.id);
          }
        }
      }
    }

    return result;
  }
}

export class AuthorizationStore implements IAuthorizationStore {
  private readonly auths: IAuthorization[] = [];
  constructor(auths?: IAuthorization[]) {
    if (auths) {
      this.auths = auths;
    }
  }

  get Authorizations(): IAuthorization[] {
    return this.auths;
  }

  addAuthorization(auth: IAuthorization): void {
    this.auths.push(auth);
  }
}
export interface IAuthService {
  fetch(req: RequestInfo, init?: RequestInit): Promise<globalThis.Response>;
  getRegistry(type: string): URL;
  get Url(): URL;
}

export interface IAuthorizationStore {
  get Authorizations(): IAuthorization[];
  addAuthorization(auth: IAuthorization): void;
}
