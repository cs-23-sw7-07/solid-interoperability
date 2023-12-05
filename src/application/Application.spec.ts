import { Application } from "./Application";
import { expect } from "@jest/globals";
import {
  Authorization,
  AuthorizationStore,
  IAuthorization,
} from "./Authorization";
import { readFileSync } from "fs";
import * as path from "path";
import { v4 as uuid } from "uuid";
import { DataInstance } from "./SolidDataInstance";
import { ProfileDocument } from "./Rdf";
import express from "express";

export const ALICE_WEBID = new URL(
  "http://localhost:3000/alice-pod/profile/card#me",
);
export const ALICE_POD = new URL("http://localhost:3000/alice-pod/");

function readPodResource(_path: string) {
  return readResource("data/" + _path)
}
function readResource(_path: string){
  return readFileSync(
      path.resolve(__dirname, "../../test/resources/", _path),
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
beforeAll(() => {});

describe("Application", () => {
  let app: Application;
  let auths: IAuthorization[];

  beforeAll(async () => {
    auths = new Array<IAuthorization>();
    const socialAgent = await ProfileDocument.fetch(ALICE_WEBID);
    auths.push(new Authorization(socialAgent));
    const authStore = new AuthorizationStore(auths);
    const app = new Application({ authStore: authStore, profile: readResource("testAppProfile.ttl") });

    const expressApp = express()
    expressApp.use(await app.getRouter())
  });

  it("Can register", () => {
    app.register(new URL(ALICE_WEBID));

    expect(app.authStore.Authorizations.length).toBe(1);
  });

  it("Can get Authorizations", () => {
    const auths = app.Authorizations;

    expect(auths.length).toBeGreaterThan(0);
  });

  it("should store Solid Data Instance", async () => {
    const instance = DataInstance.new(
      new TestInstance({}),
      auths[0].socialAgent,
    );
    const uuid = instance.id;

    //await app.store(ALICE_WEBID);

    // Check that the data is stored.
    // If this fails in the future, make sure that it should contain <member>
    expect(
      readPodResource("alice-pod/Application/TestInstance/" + uuid + "$.ttl"),
    ).toContain("<member>");
  });

  it("should retrieve Solid Data Instance", () => {
    // TODO: Check some that some data in a solid pod is parsed correctly
    const app = new Application();
    const id = "123456789";

    //const dataInstance = await app.get(ALICE_WEBID, id)
  });
});

describe("Data instance", () => {
  it("should be serializable", () => {});
});
