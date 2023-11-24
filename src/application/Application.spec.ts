import { Application } from "./Application";
import { expect } from "@jest/globals";
import {
  Authorization,
  AuthorizationStore,
  AuthService,
  IAuthorization,
} from "./Authorization";
import { readFileSync } from "fs";
import * as path from "path";
import { v4 as uuid } from "uuid";
import { DataInstance } from "./SolidDataInstance";
import { SocialAgent } from "./SocialAgent";

export const ALICE_WEBID = new URL(
  "http://localhost:3000/alice-pod/profile/card#me",
);
export const ALICE_POD = new URL("http://localhost:3000/alice-pod/");

function readPodResource(_path: string) {
  return readFileSync(
    path.resolve(__dirname, "../../test/resources/data", _path),
    { encoding: "utf-8" },
  );
}

class TestInstance {
  id: string;
  constructor(public member: object) {
    this.id = uuid();
  }
  method1(arg1: number): boolean {
    return arg1 > 0;
  }
}
beforeAll(()=>{
  
})

describe("Application", () => {
  const authService = new AuthService();
  const socialAgent = new SocialAgent(ALICE_WEBID, ALICE_POD);
  const auths = new Array<IAuthorization>();
  auths.push(new Authorization(socialAgent, authService));
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

  it("should store Solid Data Instance", async () => {
    const app = new Application(authService, authStore);
    const instance = DataInstance.new(
      new TestInstance({}),
      auths[0].socialAgent,
    );
    const uuid = instance.id;

    await app.store(ALICE_WEBID, instance);

    // Check that the data is stored.
    // If this fails in the future, make sure that it should contain <member>
    expect(
      readPodResource("alice-pod/Application/TestInstance/" + uuid + "$.ttl"),
    ).toContain("<member>");
  });

  it("should retrieve Solid Data Instance", () => {
    // TODO: Check some that some data in a solid pod is parsed correctly
  });
});

describe("Data instance", () => {
  it("should be serializable", () => {});
});
