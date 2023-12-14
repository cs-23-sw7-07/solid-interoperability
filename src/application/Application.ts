import {getResource, parseResource, Rdf} from "../data-management/data-model/RDF/rdf";
import {
  ApplicationProfileDocument,
  SocialAgentProfileDocument,
} from "../data-management/data-model/profile-documents";
import { AuthorizationAgent } from "../data-management/data-model/agents/authorizationAgent";
import {ApplicationRegistration} from "../data-management/data-model/registration/application-registration";
import {Quad} from "n3";
import {TYPE_A} from "../data-management/data-model/namespace";
import {Fetch} from "../fetch";

export class Application {
  private authStore = new Map<string, ApplicationRegistration>;
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
    this.authStore.set(webId, access)
  }

  async store(webId: string, data: Quad[]) {
    const type = data.find(quad => quad.predicate.value == TYPE_A)?.object.value
    if (!type)
          throw new Error("Data has no type.")

    const shape = await fetch(type, {headers:{Accept:"text/turtle"}})
        .then(res => res.text())
        .then(text => parseResource(Rdf, text, type))
        .then(rdf => rdf.HasShape)

    if (!shape)
      throw new Error("Data has no Shape.")

    const registry = this.authStore.get(webId);
    if (registry === undefined){
      throw new Error(`Application registration was not found for WebId ${webId}. Did you forget to register?`)
    }
    const accessGrants = await registry.getHasAccessGrants()
    const accessGrant = accessGrants.find(async (grant) => {
      return (
          (await grant.getHasDataGrant()).find(
              (dataGrant) => dataGrant.RegisteredShapeTree == shape,
          ) != undefined
      );
    });
    if (accessGrant) {

      const dataRegistration =await (await accessGrant?.getHasDataGrant()).find(
          async (grant) => (await grant.getHasDataRegistration()).RegisteredShapeTree == shape,
      )?.getHasDataRegistration();
      if (!dataRegistration) {
        throw new Error(
            `There were no Data Registration for type: ${shape} in AccessGrant.`,
        );
      }

      //STORE

    }
    throw new Error(`There are no Access Grants for the type: ${shape}.`);
  }

  retrieve(webId: string, uri: string) {}
}
