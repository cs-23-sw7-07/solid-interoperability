import N3, { NamedNode } from "n3"
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
    private writer = new N3.Writer(rdfFactory.PREFIXES, { format: "Turtle" })
    private localPrefixes: any = {prefixes: {}}

    /**
     * 
     * @param object is class implementing the `ItoRdf` interface
     * @returns a `Promise` which if furfulled contains a turtle file, otherwise an error which needs handling
     */
    createRdf(object: ItoRdf) {
        return new Promise((resolve, reject) => {
            object.toRdf(this.writer)

            this.writer.end((error, result: string) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            })
        })
    }

    /**
     * **Prefixes cannot be deleted**
     * @param key Short version name
     * @param IRI meaning of the shortname
     */
    addPrefix(key: string, IRI: NamedNode) {
        this.writer.addPrefix(key, IRI)
        this.localPrefixes.prefixes[key] = IRI
    }

    /**
     * **Prefixes cannot be deleted**
     * @params A dictionary containing keys which is the shortname inserted instead of the IRI.
     * The IRI is the value for the key given as a `RDF.NamedNode`
     */
    addPrefixes(dict: { [key: string]: NamedNode; }) {
        this.writer.addPrefixes(dict)
        for (let key in dict) {
            let value = dict[key]
            this.localPrefixes.prefixes[key] = value
        }
    }

    /**
     * @returns returns the current prefixes the `RDF` will contain and the `N3.Writer` will use.
     */
    getLocalPrefixes() {
        return this.localPrefixes
    }
}