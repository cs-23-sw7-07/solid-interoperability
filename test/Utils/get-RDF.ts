import {readFileSync} from "fs";

export function getRDFFromPath(path: string): string {
  console.log(path)
  return readFileSync(path, "utf-8");
}
