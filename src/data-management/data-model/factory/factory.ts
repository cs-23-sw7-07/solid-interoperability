import N3 from "n3"
import { ItoRdf } from "./toRdf";

const PREFIXES = {
    prefixes: {
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
        acl: 'http://www.w3.org/ns/auth/acl#',
        interop: 'http://www.w3.org/ns/solid/interop#',
    }
};

export class rdfFactory {
    createRdf(thing: ItoRdf) {
        return new Promise((resolve, reject) => {
            const writer = new N3.Writer(PREFIXES, { format: "Turtle" })
            thing.toRdf(writer)

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