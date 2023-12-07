import {getRDFFromPath} from "./get-RDF";

/* eslint-disable @typescript-eslint/no-unused-vars */
export function mock_fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    return new Promise((resolve) => {
        try {
            const body = getRDFFromPath(mockFetchResource(input as string))
            const responseInit: ResponseInit = {
                status: 200,
                headers: new Headers({
                  'Content-Type': 'text/turtle',
                }),
              };
        
              const response = new Response(body, responseInit);
              return resolve(response);
        }
        catch(e) {
            const responseInit: ResponseInit = {
                status: 404,
              };
        
              const response = new Response((e as Error).message, responseInit);
              return resolve(response);
        }
      });
}

export function mockFetchResource(tempResource: string): string {
    // This should take in a URL string
    // This should use the fetch API to fetch the actual RDF online from the server
    if (tempResource == "https://projectron.example/#id") {
      return "test/rdfs-examples/parse-tests-rdfs/profile-doc-projection.ttl";
    } else if (tempResource == "https://bob.example/#id") {
      return "test/rdfs-examples/parse-tests-rdfs/profile-doc-bob.ttl";
    } else if (tempResource == "https://jarvis.example/#id") {
      return "test/rdfs-examples/parse-tests-rdfs/profile-doc-defualt.ttl";
    }
    return tempResource;
  }