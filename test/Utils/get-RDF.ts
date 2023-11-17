import { readFileSync } from "fs";

export function getRDFFromPath(path: string): string {
  return readFileSync(path, "utf-8");
}
