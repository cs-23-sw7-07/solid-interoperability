import { Application } from "./Application";
import * as path from "path";
import { readFileSync } from "fs";
import { ApplicationProfileDocument } from "../data-management/data-model/profile-documents";
import { parseResource } from "../data-management/data-model/RDF/rdf";
import express from "express";

function readResource(_path: string) {
  return readFileSync(path.resolve(__dirname, "../../test/resources/", _path), {
    encoding: "utf-8",
  });
}

describe("Application", () => {
  let app: Application;
  let expressApp;

  beforeEach(async () => {
    const profile = await parseResource(
      ApplicationProfileDocument,
      readResource("testAppProfile.ttl"),
      "http://localhost:3002/",
    );

    app = new Application(profile);
    const router = await app.getRouter();

    expressApp = express();
    expressApp.get("/", router);
    expressApp.listen(3002);
  });

  afterEach(() => {});
  it("should register", () => {
    app.register("http://localhost:3000/Alice-pod/profile/card#me");
  });
  it("should store RDF data correctly", () => {});
  it("should retrieve RDF data correctly", () => {});
});
