import { it, expect } from "vitest";
import { isNativeNumber } from "./is";

it("is native number", () => {
  expect(isNativeNumber(0)).toBe(true);
  expect(isNativeNumber(1)).toBe(true);
  expect(isNativeNumber(-1)).toBe(false);
  expect(isNativeNumber(-1.1)).toBe(false);
  expect(isNativeNumber(1.1)).toBe(false);
});
