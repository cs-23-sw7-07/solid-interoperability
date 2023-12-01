import { NotImplementedYet } from "../Errors/NotImplementedYet";
import { URL } from "url";
import { DataInstance } from "./SolidDataInstance";
import {ProfileDocument} from "./Rdf";
import {fetch} from "solid-auth-fetcher";

export interface IAuthorization {
  readonly socialAgent: ProfileDocument;
  readonly service: IAuthService;
  store<T>(instance: DataInstance<T>): Promise<void>
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

  async store<T>(instance: DataInstance<T>){
    const url = this.service.Url.toString() + "/pods/" + this.WebId
    const registration = this.service.getRegistry(typeof instance.data)
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "text/turtle", "Link": registration.toString() },
      body: instance.Serialized,
    });
  }
}

export class AuthorizationStore implements IAuthorizationStore {
  private readonly auths:IAuthorization[] = []
  constructor(auths?: IAuthorization[]) {
    if (auths){
      this.auths = auths
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

  async fetch(req: RequestInfo, init?: RequestInit): Promise<globalThis.Response> {
    return fetch(req, init);
  }
  get Url(){
    return this.url
  }
  getRegistry(type: string): URL {
    const url = this.url
    return url;
  }
}
export interface IAuthorizationStore {
  get Authorizations(): IAuthorization[];
  addAuthorization(auth: IAuthorization): void;
}
