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

  beforeAll(async () => {
    const profile = await parseResource(
      ApplicationProfileDocument,
      readResource("testAppProfile.ttl"),
      "http://localhost:3002/",
    );

    app = new Application(profile);
    const appRouter = await app.getRouter();
    const testRouter = express.Router();
    testRouter.get("/testdata", (req, res, next) => {
      res.send()
    })

    expressApp = express();
    expressApp.get("/", appRouter);
    expressApp.use("/ldp", testRouter);
    expressApp.listen(3002);
  });

  afterEach(() => {});
  it("should register", async () => {
    await app.register("http://localhost:3000/Bob-pod/profile/card#me");
  });
  it("should store RDF data correctly", async () => {

  });
  it("should retrieve RDF data correctly", () => {});
});
