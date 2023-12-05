import { DataInstance } from "./SolidDataInstance";
import { ISocialAgent } from "./SocialAgent";
import { URL } from "url";

class TestInstance {
  constructor(public member: object) {}
}
describe("DataInstance", () => {
  const data = new TestInstance({ field: 1 });
  const owner: ISocialAgent = {
    get Pod(): URL {
      return new URL("http://localhost:3000/alice-pod/");
    },
    get WebId(): URL {
      return new URL("http://localhost:3000/alice-pod/profile/card#me");
    },
  };
  const instance = DataInstance.from(data, owner, "test-id");

  it("Serializes", () => {
    const str = instance.Serialized;

    expect(str).toBe(
      '<http://localhost:3000/alice-pod/Application/TestInstance/TestInstance/test-id> a "TestInstance";\n' +
        "    <member> <[object Object]>.\n",
    );
  });
  it("Deserializes", () => {});
});
