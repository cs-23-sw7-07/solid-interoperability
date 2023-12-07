import {expect} from "@jest/globals";
import {login} from "./login";

describe("When the system logs in:", () => {
  it("Should login", () => expect(login()).resolves.not.toThrow());
});
