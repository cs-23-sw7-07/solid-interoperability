import { AccessAuthorization } from "../data-management/data-model/authorization/access";
import { Fetch } from "../fetch";
import { getResource } from "../data-management/data-model/RDF/rdf";
import {
  ApplicationProfileDocument,
  ProfileDocument,
  SocialAgentProfileDocument,
} from "../data-management/data-model/profile-documents";
import { SocialAgent } from "../data-management/data-model/agents/socialAgent";
import { AuthorizationAgent } from "../data-management/data-model/agents/authorizationAgent";

export class Application {
  private authStore: AccessAuthorization[];
  private fetch: Fetch;

  constructor(
    private profile: ApplicationProfileDocument,
    _fetch?: Fetch,
  ) {
    if (!_fetch) this.fetch = fetch;
    else this.fetch = _fetch;

    this.authStore = [];
  }

  get WebId() {
    return this.profile.WebId;
  }

  async getRouter() {
    const profile = await this.profile.Serialized;
    return (req: any, res: any, next: any) => {
      let content;
      for (const type of req.accepts()) {
        if (type.includes("turtle")) {
          content = profile;
          break;
        }
      }
      if (content != undefined) {
        res.send(content);
      }
      next();
    };
  }

  async register(webId: string) {
    const current = this.authStore.find((auth) => auth.GrantedBy.WebID);
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
    const access = await authAgent.requestAccess();
  }

  store(webId: string, data: string) {}

  retrieve(webId: string, uri: string) {}
}
