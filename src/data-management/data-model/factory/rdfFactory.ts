import N3 from "n3"
import { ItoRdf } from "./ItoRdf";

/**
 * This factory is used for `RDF` creation via. the `createRdf` function.
 * It uses the `N3.writer` to create a turtle (.ttl) file.
 */
export class rdfFactory {
    static PREFIXES = {
        prefixes: {
            rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
            xsd: 'http://www.w3.org/2001/XMLSchema#',
            acl: 'http://www.w3.org/ns/auth/acl#',
            interop: 'http://www.w3.org/ns/solid/interop#',
        }
    };
    /**
     * 
     * @param object is class implementing the `ItoRdf` interface
     * @returns a `Promise` which if furfulled contains a turtle file, otherwise an error which needs handling
     */
    createRdf(object: ItoRdf) {
        return new Promise((resolve, reject) => {
            const writer = new N3.Writer(rdfFactory.PREFIXES, { format: "Turtle" })

            object.toRdf(writer)

            writer.end((error, result: string) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        })
    }
}