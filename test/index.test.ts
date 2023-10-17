
import {expect} from "@jest/globals";
import {authenticate, hello} from "../src";


test(
    "Test",
    () => expect(hello()).toBe("hello")
)
test(
    "Authentication returns token",
    () => expect(authenticate()).toBe("token")
)