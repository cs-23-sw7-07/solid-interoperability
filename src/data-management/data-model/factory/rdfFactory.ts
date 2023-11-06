import N3 from "n3";
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

  /**
   *
   * @param object is class implementing the `ItoRdf` interface
   * @param prefixes must be an object of form `{keys: 'values'}`.
   * Otherwise uses `RdfFactory.PREFIXES`
   * @returns a `Promise` which if furfulled contains a turtle file, otherwise an error which needs handling
   *
   */
  create(object: ItoRdf, prefixes?: object) {
    const finalPrefix = {
      prefixes: { ...prefixes, ...RdfFactory.PREFIXES.prefixes },
    };
    const writer = new N3.Writer(finalPrefix, { format: "Turtle" });

    return new Promise((resolve, reject) => {
      object.toRdf(writer);

      writer.end((error, result: string) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}
