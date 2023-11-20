import {
  Application,
  AuthorizationStore,
  IAuthorization,
  IAuthService,
  ISolidDataInstance,
  SolidDataInstance,
} from "./Application";
import { expect } from "@jest/globals";
import { Authorization } from "./Authorization";
import { NotImplementedYet } from "../Errors/NotImplementedYet";

describe("Application", () => {
  const authService: IAuthService = {
    request(req: RequestInfo, init?: RequestInit): Promise<Response> {
      throw new NotImplementedYet();
    },
  };
  const auths = new Array<IAuthorization>();
  auths.push(
    new Authorization(
      new URL("http://localhost:3000/alice-pod/profile/card#me"),
      authService,
    ),
  );
  const authStore = new AuthorizationStore(auths);

  it("Can register", () => {
    const app = new Application(authService, authStore);

    //TODO: How to test?
  });

  it("Can get Authorizations", () => {
    const app = new Application(authService, authStore);

    const auths = app.Authorizations;

    expect(auths.length).toBeGreaterThan(0);
  });
});

describe("Data instance", () => {
  class TestInstance implements ISolidDataInstance {
    constructor(public member: object) {}
    method1(arg1: number): boolean {
      return arg1 > 0;
    }
  }
  it("should be serializable", () => {
    const inst = new TestInstance({ hello: "Hi" });
    const testRegistry = new URL("http://localhost:3000/alice-pod/test-app/")

    console.log(SolidDataInstance.serialize(inst, testRegistry));
  });
});
