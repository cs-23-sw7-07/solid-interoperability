import { Fetch } from "../../fetch";
import { serializeTurtle } from "../turtle/turtle-serializer";
import { ParserResult, parseTurtle } from "../turtle/turtle-parser";
import {Store} from "n3";
import {DatasetCore} from "@rdfjs/types";

export async function insertTurtleResource(fetch: Fetch, uri: string, documentRdf: string) {
    await fetch(uri, {
        method: "PUT",
        body: documentRdf,
        headers: {
            link: '<https://www.w3.org/ns/ldp#Resource>; rel="type"',
            "Content-Type": "text/turtle",
        },
    }).then((res) => {
        if (!res.ok) {
            return new InsertResourceError(`Couldn't insert resource at ${uri}`);
        }
    });
}

export async function createContainer(fetch: Fetch, uriContainer: string) {
    const headers = new Headers({
        "Content-Type": "text/turtle",
    });

    const requestOptions: RequestInit = {
        method: "PUT",
        headers: headers,
    };

    const response = await fetch(uriContainer, requestOptions);
    if (!response.ok) {
        throw new Error(`failed to create containers ${uriContainer} ${response}`);
    }
}

// export function getDescriptionResource(linkHeaderText: string): string | undefined {
//     const links = LinkHeader.parse(linkHeaderText).refs;
//     return links.find((link) => link.rel === 'describedby')?.uri;
//   }

// export async function discoverDescriptionResource(session : Session, iri : string): Promise<string> {
//     const headResponse = await session.fetch(iri, {
//       method: 'HEAD'
//     });

//     return getDescriptionResource(headResponse.headers.get('Link')!)!;
//   }

async function insertPatch(dataset: Store): Promise<string> {
    return `
      PREFIX interop: <http://www.w3.org/ns/solid/interop#>
      INSERT DATA {
        ${await serializeTurtle(dataset, {})}
      }
    `;
}

export async function updateContainerResource(
    fetch: Fetch,
    containerIri: string,
    dataset: Store,
) {
    const body = await insertPatch(dataset);
    await fetch(containerIri + ".meta", {
        method: "PATCH",
        body: body,
        headers: {
            "Content-Type": "application/sparql-update",
        },
    }).then((res) => {
        if (!res.ok) {
            throw new Error(`failed to patch ${containerIri}`);
        }
    });
}

export async function deleteContainerResource(fetch: Fetch, containerIRI: string): Promise<void> {
    const { ok } = await fetch(containerIRI, {
        method: "DELETE",
    });

    if (!ok) {
        throw new Error(`Failed to delete data at ${containerIRI}`);
    }
}

export async function readResource(fetch: Fetch, url: string): Promise<string> {
    let res = await fetch(url);
    if (res.ok) return res.text();
    throw new ReadResourceError("Couldn't read the resource at " + url);
}

export async function readParseResource(fetch: Fetch, url: string): Promise<ParserResult> {
    const res = await fetch(url);
    if (!res.ok) {
        throw new FetchError(res.statusText + " " + url);
    }
    const res_1 = await res.text();
    return await parseTurtle(res_1, url);
}

class InsertResourceError extends Error {
    constructor(public message: string) {
        super(message);
    }
}

class ReadResourceError extends Error {
    constructor(public message: string) {
        super(message);
    }
}

class FetchError extends Error {
    constructor(message: string) {
        super(message);
    }
}


export async function deleteSPARQLUpdate(dataset: DatasetCore, subject?: string, predicate?: string): Promise<string> {
    if (subject && predicate) {
        return `
        PREFIX interop: <http://www.w3.org/ns/solid/interop#>

        DELETE WHERE
        { 
            <${subject}> <${predicate}> ?o .
        }
    `;
    }
    
    return `
        PREFIX interop: <http://www.w3.org/ns/solid/interop#>

        DELETE WHERE
        { 
            ${await serializeTurtle(dataset, {})}
        }
    `;
    
    
}

export async function insertSPARQLUpdate(dataset: DatasetCore): Promise<string> {
    return `
        PREFIX interop: <http://www.w3.org/ns/solid/interop#>
        
        INSERT DATA
        { 
            ${await serializeTurtle(dataset, {})}
        }
    `;
}