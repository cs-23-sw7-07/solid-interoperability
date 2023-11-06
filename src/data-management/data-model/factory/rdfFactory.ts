import N3, { NamedNode } from "n3";
import { ItoRdf } from "./ItoRdf";

/**
 * This factory is used for `RDF` creation via. the `createRdf` function.
 * It uses the `N3.writer` to create a turtle (.ttl) file.
 */
export class RdfFactory {
  private static PREFIXES = {
    prefixes: {
      rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
      rdfs: "http://www.w3.org/2000/01/rdf-schema#",
      xsd: "http://www.w3.org/2001/XMLSchema#",
      acl: "http://www.w3.org/ns/auth/acl#",
      interop: "http://www.w3.org/ns/solid/interop#",
    },
  };
  private writer = new N3.Writer(RdfFactory.PREFIXES, { format: "Turtle" });

  /**
   *
   * @param object is class implementing the `ItoRdf` interface
   * @returns a `Promise` which, if fulfilled, contains a turtle file, otherwise an error which needs handling
   */
  create(object: ItoRdf) {
    return new Promise((resolve, reject) => {
      object.toRdf(this.writer);

      this.writer.end((error, result: string) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
  /**
   * @param object is class implementing the `ItoRdf` interface
   * @param prefixes must be an object of form `{prefixes: {keys: 'values'}}`
   * @returns an `RDF` if `Promise` resolves else rejects and returns an `Error`
   */
  createWithPrefixes(object: ItoRdf, prefixes: any) {
    let tempWriter = new N3.Writer(prefixes, { format: "Turtle" });
    return new Promise((resolve, reject) => {
      object.toRdf(tempWriter);

      tempWriter.end((error, result: string) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}
