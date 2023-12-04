import { Authorization } from "./Authorization";
import { ProfileDocument } from "./Rdf";
import { URL } from "url";
import { NotImplementedError } from "@inrupt/solid-client-authn-node";
import N3, { DataFactory } from "n3";
import namedNode = DataFactory.namedNode;

describe("Authorization", () => {
  const service = {
    get Url(): URL {
      throw new NotImplementedError("");
    },
    fetch(req: RequestInfo, init?: RequestInit): Promise<globalThis.Response> {
      throw new NotImplementedError("");
    },
    getRegistry(type: string): URL {
      throw new NotImplementedError("");
    },
  };
  it.skip("should get all data instances that it has access to.", () => {});
  it("should be able to save a data instance", async () => {
    const authorization = new Authorization(
      await ProfileDocument.fetch(
        new URL("http://localhost:3000/weed/profile/card#me"),
      ),
      service,
    );
    const quad = new N3.Quad(
      namedNode("thisIsSubject"),
      namedNode("thisIsPredicate"),
      namedNode("thisIsObject"),
    );
    await authorization.store([quad], new URL("http://localhost:3000/weed/"));
  });
});
