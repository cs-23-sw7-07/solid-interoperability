import { NotImplementedYet } from "../Errors/NotImplementedYet";
import { URL } from "url";
import { DataInstance } from "./SolidDataInstance";
import { ProfileDocument } from "./Rdf";
import { fetch } from "solid-auth-fetcher";
import N3 from "n3";
import { DataRegistration } from "../data-management/data-model/data-registration/data-registration";

export interface IAuthorization {
  readonly socialAgent: ProfileDocument;
  readonly service: IAuthService;
  store(instance: N3.Quad[], dataRegistration: URL): Promise<void>;
  get DataInstances(): DataInstance<unknown>[];
}

export class Authorization implements IAuthorization {
  constructor(
    readonly socialAgent: ProfileDocument,
    readonly service: IAuthService,
  ) {}

  get WebId() {
    return this.socialAgent.WebId;
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
      console.log(result);
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/turtle" },
        body: result,
      });
    });
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
export class AuthService implements IAuthService {
  constructor(private url: URL) {}

  async fetch(
    req: RequestInfo,
    init?: RequestInit,
  ): Promise<globalThis.Response> {
    return fetch(req, init);
  }
  get Url() {
    return this.url;
  }
  getRegistry(type: string): URL {
    const url = this.url;
    return url;
  }
}
export interface IAuthorizationStore {
  get Authorizations(): IAuthorization[];
  addAuthorization(auth: IAuthorization): void;
}
