import { Authorization } from "./Authorization";
import { AuthService, IAuthService, ISolidDataInstance } from "./Application";
import * as http from "http";
import { fetch } from "solid-auth-fetcher";

describe("Authorization", () => {
  const testAuth: IAuthService = {
    request(req, init?): Promise<Response> {
      return fetch(req, init);
    },
  };

  it.skip("should get all data instances that it has access to.", () => {
    const instances = new Array<ISolidDataInstance>();
    instances.push({});

    const auth = new Authorization(
      new URL("http://localhost:3000/alice-pod/profile/card#me"),
      testAuth,
    );

    expect(auth.DataInstances.length).toBeGreaterThan(0);
  });
  it("should be able to save a data instance", () => {});
});
