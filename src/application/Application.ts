import { URL } from "url";
import { DataInstance } from "./SolidDataInstance";
import {
  Authorization,
  AuthorizationStore,
  IAuthorization,
  IAuthorizationStore,
} from "./Authorization";
import { getAuthAgent } from "../authentication/authentication";
import { NotImplementedYet } from "../Errors/NotImplementedYet";
import * as fs from "fs";
import { SocialAgent } from "./SocialAgent";
import { ProfileDocument } from "./Rdf";
import N3 from "n3";

/**
 * Interface for Solid Applications.
 */
export interface IApplication {
  store(webId: URL, instance: N3.Quad[]): Promise<void>;
  getProfile(): Promise<ProfileDocument>;
}

/**
 * @member name The name of the application.
 * @member profile The path to the application's profile document.
 */
interface IApplicationOptions {
  name?: string;
  profile?: string;
  authStore?: AuthorizationStore;
  authService?: URL;
}

export class Application implements IApplication {
  authStore: IAuthorizationStore;
  /**
   * The main interface for Solid application. The {@link Application} API contains the necessary functionality to create a
   * solid application. To create a Solid application, simply instantiate an {@link Application} and plug it into your express
   * router. The {@link Application}
   *
   * @param authService
   * @param authenticationStore
   * @param options
   */
  constructor(private options?: IApplicationOptions) {
    this.authStore = this.options?.authStore ?? new AuthorizationStore();
  }

  /**
   * Returns the name of this application.
   */
  get Name() {
    // TODO: This should come from the profile document of this application.
    return this.options?.name ?? "Application";
  }

  async getProfile() {
    const profile = this.options?.profile;

    if (profile == undefined) {
      throw new Error(
        "This application does not have a profile document. Please pass one to the constructor upon " +
          "instantiation.",
      );
    }

    return ProfileDocument.parse(profile);
  }

  /**
   * Register with the authorization agent of the agent.
   */

  async register(webId: URL): Promise<void> {
    let authStore = this.authStore;
    if (authStore == undefined) {
      //TODO: Save new authstore
      authStore = new AuthorizationStore();
      this.authStore = authStore;
    }

    const profile = await ProfileDocument.fetch(webId);
    const auth = await Authorization.create(this, profile);

    authStore.addAuthorization(auth);
  }

  /**
   * Retrieve all registered authorizations.
   */
  get Authorizations(): IAuthorization[] {
    return this.authStore.Authorizations;
  }

  /**
   * Retrieve the {@link Authorization} for a specific agent.
   * @param webId The WebId of the agent.
   */
  getAuthorization(webId: URL): IAuthorization | undefined {
    // Maybe this should be a database?
    return this.Authorizations.find(
      (x) => x.socialAgent.WebId.toString() == webId.toString(),
    );
  }

  /**
   * Store data in a Solid pod. The data will be stored in RDF format using an appropriate method of conversion for its
   * type. The data that is stored must be wrapped in a {@link DataInstance} so that it can be serialized as valid RDF.
   * So long as the application has a valid authorization, given by an authorization agent of *alice.example.com*, the
   * app will be able to store `myObj` in alice's pod.
   *
   * @example
   *  class MyData {
   *      constructor(private obj: object) {}
   *  }
   *
   *  const myObj = new MyData({member: "value"});
   *  const id = new URL("alice.example.com")
   *  app.store(id, myObj)
   *
   * @param webId The WebId of the agent that owns the pod where the data should be registered.
   * @param instance A [[DataInstance]] that wraps the data being stored.
   */
  async store(webId: URL, instance: N3.Quad[]): Promise<void> {
    const authAgent = getAuthAgent(webId);

    if (authAgent == undefined)
      throw new Error(
        `Social agent with WebID ${webId}, does not have an authorization agent.`,
      );

    const auth = this.getAuthorization(webId);

    if (auth == undefined) {
      throw new Error(
        `Social agent with WebId ${webId} has not authorized this application.`,
      );
    }
    let shape = instance.find(
      (graph) =>
        graph.predicate.value == "http://www.w3.org/ns/shapetrees#shape",
    )?.object.value;

    if (!shape) {
      shape = "unshaped";
    }

    const registry = await auth.getApplicationRegistration();

    const accessGrant = registry.hasAccessGrant.find((grant) => {
      return (
        grant.hasDataGrant.find(
          (dataGrant) => dataGrant.registeredShapeTree == shape,
        ) != undefined
      );
    });
    if (accessGrant) {
      const dataRegistration = accessGrant?.hasDataGrant.find(
        (grant) => grant.hasDataRegistration.registeredShapeTree == shape,
      )?.hasDataRegistration;
      if (!dataRegistration) {
        throw new Error(
          `There were no Data Registration for type: ${shape} in AccessGrant.`,
        );
      }
      await auth.store(instance, new URL(dataRegistration.id));
    }
    throw new Error(`There are no Access Grants for the type: ${shape}.`);
  }

  async *dataInstances(webId: URL) {
    // Get data instances of given type.
    const auth = this.getAuthorization(webId);

    if (auth == undefined) {
      throw new Error(
        `Social agent with WebId ${webId} has not authorized this application.`,
      );
    }
  }

  /**
   * Returns an express router that sends the profile document of the application when the request asks for
   * "text/turtle" as content type.
   */
  async getRouter() {
    const profile = await this.getProfile();

    return (req: any, res: any, next: any) => {
      let content;
      for (const type of req.accepts()) {
        if (type.includes("turtle")) {
          content = profile.Document;
          break;
        }
      }
      if (content != undefined){
        req.
        res.send(content)
      }
      next();
    };
  }

  getSocialAgents(webId: URL): SocialAgent {
    throw new NotImplementedYet();
  }
}