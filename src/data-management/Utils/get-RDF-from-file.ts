import {readFileSync} from "fs";
import {join} from "path";

export function getRDFFromFile(path: string): string {
    return readFileSync(path, 'utf-8')
}