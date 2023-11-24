import { URL } from "url";
import { DataInstance } from "./SolidDataInstance";
import {
  IAuthorization,
  IAuthorizationStore,
  IAuthService,
} from "./Authorization";
import { Type } from "typedoc";
import { getAuthAgent } from "../authentication/authentication";

/**
 * Interface for Solid Applications.
 */
export interface IApplication {
  store<T>(webId: URL, instance: DataInstance<T>): Promise<void>;
  dataInstances<T extends Type>(
    webId: URL,
    type: T,
  ): AsyncGenerator<DataInstance<unknown>>;
}

/**
 * @member name The name of the application.
 * @member profile The path to the application's profile document.
 */
interface IApplicationOptions {
  name?: string;
  profile?: string;
}

export class Application implements IApplication {
  /**
   * The main interface for Solid application. The {@link Application} API contains the necessary functionality to create a
   * solid application. To create a Solid application, simply instantiate an {@link Application} and plug it into your express
   * router. The {@link Application}
   *
   * @param authService
   * @param authenticationStore
   * @param options
   */
  constructor(
    private authService: IAuthService,
    private authenticationStore: IAuthorizationStore,
    private options?: IApplicationOptions,
  ) {}

  /**
   * Returns the name of this application.
   */
  get Name() {
    // TODO: This should come from the profile document of this application.
    return this.options?.name ?? "Application";
  }

  /**
   * Register with the authorization agent of the agent.
   */
  async register(): Promise<void> {}

  /**
   * Retrieve all registered authorizations.
   */
  get Authorizations(): IAuthorization[] {
    return this.authenticationStore.Authorizations;
  }

  /**
   * Retrieve the {@link Authorization} for a specific agent.
   * @param webId The WebId of the agent.
   */
  getAuthorization(webId: URL): IAuthorization | undefined {
    // Maybe this should be a database?
    return this.Authorizations.find((x) => x.socialAgent.webId == webId);
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
  async store<T>(webId: URL, instance: DataInstance<T>): Promise<void> {
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
    const s = instance.Serialized;

    const uri = new URL(instance.id, instance.DataRegistry);
    await auth.service.fetch(uri.toString(), {
      method: "PUT",
      headers: { "Content-Type": "text/turtle" },
      body: s,
    });
  }

  async *dataInstances<T extends Type>(webId: URL, type: T) {
    // Get data instances of given type.
    const list = [DataInstance.empty(type)];

    // Yield each instance.
    for (const x of list) {
      yield x;
    }
  }

  /**
   * Returns an express router that sends the profile document of the application when the request asks for
   * "text/turtle" as content type.
   */
  get Router() {
    return (req: any, res: any, next: any) => {
      for (const type of req.accepts()) {
        if (type.includes("turtle")) {
          // TODO: Send Profile Document
          res.send("TURTLE");
          return;
        }
      }
      next();
    };
  }
}
