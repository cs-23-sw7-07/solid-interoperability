import {
  IAuthorization,
  IAuthService,
  ISolidDataInstance,
} from "./Application";
import { NotImplementedYet } from "../Errors/NotImplementedYet";

export class Authorization implements IAuthorization {
  constructor(
    protected webId: URL,
    protected authService: IAuthService,
  ) {}

  get WebId() {
    return this.webId;
  }

  get DataInstances(): ISolidDataInstance[] {
    throw new NotImplementedYet();
  }
}
