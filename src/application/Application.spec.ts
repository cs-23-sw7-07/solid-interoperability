import { Application } from "./Application";
import * as path from "path";
import { readFileSync } from "fs";
import { ApplicationProfileDocument } from "../data-management/data-model/profile-documents";
import { parseResource } from "../data-management/data-model/RDF/rdf";
import express from "express";
import { existsSync } from "fs";

const resourcePath = path.resolve(__dirname, "../../test/resources/");
const serverPath = path.resolve(__dirname, "../../solid-server");
const aliceWebId = "http://localhost:3000/Alice-pod/profile/card#me";

function readResource(_path: string) {
  return readFileSync(path.resolve(resourcePath, _path), {
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
    testRouter.get("/testdata", (req, res) => {
      res.send();
    });

    expressApp = express();
    expressApp.use(
      express.static(path.join(__dirname, "../../test/resources")),
    );
    expressApp.get("/", appRouter);
    expressApp.use("/ldp", testRouter);
    expressApp.listen(3002);
  });

  it("should be able to fetch RDF file", async () => {
    const res1: Response = await fetch("http://localhost:3002/testThing1.ttl", {
      headers: { Accepts: "text/turtle" },
    });
    const res2: Response = await fetch("http://localhost:3002/shapes.shex", {
      headers: { Accepts: "text/shex" },
    });
    const res3: Response = await fetch(
      "http://localhost:3002/shapeTreeTestThing.shex",
      { headers: { Accepts: "text/shex" } },
    );
    console.log(await res3.text());
    expect(await res1.text()).toBe(
      "@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "@prefix localhost: <http://localhost:3001/ldp#>\n" +
        "\n" +
        "localhost:576520a6-af5a-4cf9-8b40-8b1512b59c73\\#Thing\n" +
        "  a localhost:Task ;\n" +
        '  rdfs:label "Test task 1" .',
    );
    expect(await res2.text()).toBe(
      "PREFIX localhost: <http://localhost:3001/ldp#>\n" +
        "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\n" +
        "\n" +
        "<#Test> {\n" +
        "  a [localhost:Test] ;\n" +
        "  rdfs:label xsd:string;\n" +
        "  localhost:hasThing IRI *\n" +
        "}\n" +
        "\n" +
        "<#Thing> {\n" +
        "  a [localhost:Thing] ;\n" +
        "  rdfs:label xsd:string\n" +
        "}",
    );
  });

  afterEach(() => {});

  it("should register.", async () => {
    const registration = await app.register(aliceWebId);

    const path = registration.uri.replace("http://localhost:3000", serverPath);

    expect(existsSync(path)).toBeTruthy();
  });

  let storedData: string;
  const data = readResource("testDataInstance.ttl");
  it("should store RDF data correctly", async () => {
    storedData = await app.store(
      aliceWebId,
      data,
      "https://shapetrees.example/solid/Project",
    );

    const path =
      storedData.replace("http://localhost:3000", serverPath) + "$.ttl";

    expect(existsSync(path)).toBeTruthy();
  });

  it("should retrieve RDF data correctly", async () => {
    const retrieved = await app.retrieve(aliceWebId, storedData);

    expect(retrieved).toBe(data);
  });
});
