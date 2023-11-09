import { readFileSync } from "fs";

export function getRDFFromFile(path: string): string {
  return readFileSync(path, "utf-8");
}
