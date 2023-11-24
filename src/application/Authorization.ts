import { NotImplementedYet } from "../Errors/NotImplementedYet";
import {URL} from "url";
import {DataInstance} from "./SolidDataInstance";
import {ISocialAgent} from "./SocialAgent";

export interface IAuthorization {
  readonly socialAgent: ISocialAgent;
  readonly service: IAuthService;
  get DataInstances(): DataInstance<unknown>[];
}

export class Authorization implements IAuthorization {
  constructor(
    readonly socialAgent: ISocialAgent,
    readonly service: IAuthService,
  ) {}

  get WebId() {
    return this.socialAgent.webId;
  }

  get DataInstances(): DataInstance<unknown>[] {
    throw new NotImplementedYet();
  }

}
export class AuthorizationStore implements IAuthorizationStore {
  constructor(private auths: IAuthorization[]) {}

  get Authorizations(): IAuthorization[] {
    return this.auths;
  }

  addAuthorization(auth: IAuthorization): void {
    this.auths.push(auth);
  }
}
export interface IAuthService {
  fetch(req: RequestInfo, init?: RequestInit): Promise<Response>;
}
export class AuthService implements IAuthService {
  requestAccess(webId: URL): void {}
  queryAccess(webId: URL) {}

  async fetch(req: RequestInfo, init?: RequestInit): Promise<Response> {
    return fetch(req, init);
  }
}
export interface IAuthorizationStore {
  get Authorizations(): IAuthorization[];
  addAuthorization(auth: IAuthorization): void;
}
