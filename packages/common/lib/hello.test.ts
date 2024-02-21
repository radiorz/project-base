// sum.test.js
import { expect, test } from "vitest";
import { hello } from "./main";

test("hello", () => {
  expect(hello()).toBe("hello world!");
});
