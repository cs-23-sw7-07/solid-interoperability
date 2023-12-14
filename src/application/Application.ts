import { getResource } from "../data-management/data-model/RDF/rdf";
import {
  ApplicationProfileDocument,
  SocialAgentProfileDocument,
} from "../data-management/data-model/profile-documents";
import { AuthorizationAgent } from "../data-management/data-model/agents/authorizationAgent";
import { ApplicationRegistration } from "../data-management/data-model/registration/application-registration";
import { Fetch } from "../fetch";
import { RegistrationError } from "../Errors/RegistrationError";
import { randomUUID } from "crypto";

export class Application {
  private authStore = new Map<string, ApplicationRegistration>();
  private fetch: Fetch;

  constructor(
    private profile: ApplicationProfileDocument,
    _fetch?: Fetch,
  ) {
    if (!_fetch) this.fetch = fetch;
    else this.fetch = _fetch;
  }

  get WebId() {
    return this.profile.WebId;
  }

  async getRouter() {
    const profile = await this.profile.Serialized;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (req: any, res: any, next: any) => {
      let content;
      for (const type of req.accepts()) {
        if (type.includes("turtle")) {
          content = profile;
          break;
        }
      }
      if (content != undefined) {
        res.contentType("text/turtle").send(content);
      }
      next();
    };
  }

  async register(webId: string) {
    const current = this.authStore.get(webId);
    if (current != undefined)
      throw new RegistrationError(`${webId} is all ready ready registered.`);

    // Perform registration
    const profile = await getResource(
      SocialAgentProfileDocument,
      this.fetch,
      webId,
    );
    const authAgentStr = await profile.getAuthorizationAgents();
    if (!authAgentStr)
      throw new RegistrationError(
        `${webId} does not have any authorization agent.`,
      );

    const authAgent = new AuthorizationAgent(authAgentStr[0], fetch);

    const access = await authAgent.requestAccess(this.WebId);
    this.authStore.set(webId, access);
    return access;
  }

  async store(webId: string, data: string, shapetree: string) {
    const registry = this.authStore.get(webId);
    if (registry === undefined) {
      throw new Error(
        `Application registration was not found for WebId ${webId}. Did you forget to register?`,
      );
    }
    const accessGrants = await registry.getHasAccessGrants();
    let dataGrant;
    for (const grant of accessGrants) {
      dataGrant = (await grant.getHasDataGrant()).find(
        (Grant) => Grant.RegisteredShapeTree == shapetree,
      );
      if (dataGrant) break;
    }

    if (dataGrant != undefined) {
      const dataRegistration = await dataGrant.getHasDataRegistration();

      if (!dataRegistration) {
        throw new Error(
          `There were no Data Registration for type: ${shapetree} in AccessGrant.`,
        );
      }

      const location = dataRegistration.uri + randomUUID();

      const res = await this.fetch(location, {
        headers: { "Content-Type": "text/turtle" },
        method: "PUT",
        body: data,
      });

      if (!res.ok)
        throw Error(
          `Response from server was: ${res.status}: ${await res.text()}`,
        );

      return location;
    } else
      throw new Error(`There are no Access Grants for the type: ${shapetree}.`);
  }

  async retrieve(webId: string, uri: string) {
    if (!this.authStore.get(webId))
      throw new Error(`${webId} is not registered.`);
    return await fetch(uri, { headers: { Accept: "text/turtle" } }).then(
      (res) => res.text(),
    );
  }
}
