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
    expressApp.use(express.static(path.join(__dirname, "../../test/resources")));
    expressApp.get("/", appRouter);
    expressApp.use("/ldp", testRouter);
    expressApp.listen(3002);

  });

  it("should be able to fetch RDF file", async () => {
    let res1: Response = await fetch("http://localhost:3002/testThing1.ttl", {headers: {Accepts: "text/turtle"}});
    let res2: Response = await fetch("http://localhost:3002/shapes.shex", {headers: {Accepts: "text/shex"}});
    let res3: Response = await fetch("http://localhost:3002/shapeTreeTestThing.shex", {headers: {Accepts: "text/shex"}});
    console.log(await res3.text());
    expect(await res1.text()).toBe("@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n" +
        "@prefix localhost: <http://localhost:3001/ldp#>\n" +
        "\n" +
        "localhost:576520a6-af5a-4cf9-8b40-8b1512b59c73\\#Thing\n" +
        "  a localhost:Task ;\n" +
        "  rdfs:label \"Test task 1\" .")
    expect(await res2.text()).toBe("PREFIX localhost: <http://localhost:3001/ldp#>\n" +
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
        "}")
  });

  afterEach(() => {});
  it("should register", async () => {
    await app.register("http://localhost:3000/Bob-pod/profile/card#me");
  });
  it("should store RDF data correctly", async () => {

  });
  it("should retrieve RDF data correctly", () => {});
});
