import { Application } from "./Application";
import { expect } from "@jest/globals";
import { readFileSync } from "fs";
import * as path from "path";

import express from "express";

export const ALICE_WEBID = new URL(
  "http://localhost:3000/alice-pod/profile/card#me",
);

function readPodResource(_path: string) {
  return readResource("data/" + _path);
}
function readResource(_path: string) {
  return readFileSync(path.resolve(__dirname, "../../test/resources/", _path), {
    encoding: "utf-8",
  });
}


describe("Application", () => {
  let app: Application;

  beforeAll(async () => {
    app = new Application({
      profile: readResource("testAppProfile.ttl"),
    });

    const expressApp = express();
    const router = await app.getRouter();
    expressApp.get("/", router);
    expressApp.listen(3002);
  });

  it("should provide profile document.", async () => {
    const res = await fetch("http://localhost:3002/", {
      headers: { Accept: "text/turtle" },
    });

    expect(await res.text()).toBe((await app.getProfile()).Document);
  });

  it("can register", async () => {
    try {
      await app.register(new URL(ALICE_WEBID));
    } catch (e) {
      console.log(e);
      throw e;
    }

    expect(app.authStore.Authorizations.length).toBe(1);
  });

  it("can get Authorizations", () => {
    const auths = app.Authorizations;

    expect(auths.length).toBeGreaterThan(0);
  });

  it.skip("should store RDF data", async () => {

  });

  it.skip("should retrieve RDF data", () => {

  });
});