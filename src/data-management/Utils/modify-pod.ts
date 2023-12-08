import {Fetch} from "../../fetch";
import {serializeTurtle} from "../turtle/turtle-serializer";
import {ParserResult, parseTurtle} from "../turtle/turtle-parser";
import {Store} from "n3";
import {DatasetCore} from "@rdfjs/types";
import {InsertResourceError} from "../../Errors/insert-resource-error";
import {ReadResourceError} from "../../Errors/read-resource-error";
import {FetchError} from "../../Errors/fetch-error";

export async function insertTurtleResource(
  fetch: Fetch,
  uri: string,
  documentRdf: string,
) {
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

export async function create(fetch: Fetch, uriContainer: string) {
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
export async function deleteContainerResource(
  fetch: Fetch,
  containerIRI: string,
): Promise<void> {
  const { ok } = await fetch(containerIRI, {
    method: "DELETE",
  });

  if (!ok) {
    throw new Error(`Failed to delete data at ${containerIRI}`);
  }
}

export async function readResource(fetch: Fetch, url: string): Promise<string> {
  const res = await fetch(url);
  if (res.ok) return res.text();
  throw new ReadResourceError("Couldn't read the resource at " + url);
}

export async function readParseResource(
  fetch: Fetch,
  url: string,
): Promise<ParserResult> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new FetchError(res.statusText + " " + url);
  }
  const body = await res.text();
  return await parseTurtle(body, url);
}

export async function patchSPARQLUpdate(
    fetch: Fetch,
    uri: string,
    body: string,
    withMeta: boolean = true,
): Promise<Response> {
  let res = await fetch(uri + (withMeta ? ".meta" : ""), {
    method: "PATCH",
    body: body,
    headers: {
      "Content-Type": "application/sparql-update",
    },
  });
  if (!res.ok) {
    throw new Error(
        `failed to patch ${uri}, body: ${body}, Response: ${res.statusText} ${res.status}`,
    );
  }
  return res;
}

export async function deleteSPARQLUpdate(
  dataset: DatasetCore,
): Promise<string> {
  return `
        PREFIX interop: <http://www.w3.org/ns/solid/interop#>

        DELETE WHERE
        { 
            ${await serializeTurtle(dataset, {})}
        }
    `;
}

export async function insertSPARQLUpdate(
  dataset: DatasetCore,
): Promise<string> {
  return `
        PREFIX interop: <http://www.w3.org/ns/solid/interop#>
        
        INSERT DATA
        { 
            ${await serializeTurtle(dataset, {})}
        }
    `;
}
