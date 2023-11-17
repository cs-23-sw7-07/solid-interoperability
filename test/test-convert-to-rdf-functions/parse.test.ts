import * as ExampleInstances from "../test-case";
import {AccessAuthorization, ApplicationRegistration, DataAuthorization, InvalidAccessMode, InvalidDate, NotImplementedYet, NotParsable, RdfFactory} from "../../src/index";
import { getRDFFromPath } from "../Utils/get-RDF";

function mockFetchResource(tempResource: string): string {
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
/* eslint-disable @typescript-eslint/no-unused-vars */
function fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
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
              resolve(response);
        }
        catch {
            const responseInit: ResponseInit = {
                status: 404,
              };
        
              const response = new Response(null, responseInit);
              resolve(response);
        }
      });
}

test.each([
    { name: '47e07897', rdfFilePath: "test/rdfs-examples/parse-tests-rdfs/47e07897AccessAuth-parse.ttl", instance: ExampleInstances.accessAuthorizatione47e07897Parse }
])('Test-fromRdftoAccessAuthorization', async (arg) => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const args: Map<string, any> | Error = await new RdfFactory().parse(fetch, arg.rdfFilePath);
    if (args instanceof Error) {
        fail(args)
    }
    const accessAuthorization: AccessAuthorization = AccessAuthorization.makeAccessAuthorization(args);

    expect(accessAuthorization).toStrictEqual(arg.instance);
})

test.each([
    { name: 'Test-ScopeOfAuth-AllFromAgent-RDF', rdfFilePath: "test/rdfs-examples/parse-tests-rdfs/0e4cb692DataAuth-parse-ScopeOfAuth-AllFromAgent.ttl", instance: ExampleInstances.dataAuthorization0e4cb692ScopeOfAuthAllFromAgent},
    { name: 'Test-ScopeOfAuth-AllFromRegistry-RDF', rdfFilePath: "test/rdfs-examples/parse-tests-rdfs/0e4cb692DataAuth-parse-ScopeOfAuth-AllFromRegistry.ttl", instance: ExampleInstances.dataAuthorization0e4cb692ScopeOfAuthAllFromRegistry},
    { name: 'Test-ScopeOfAuth-SelectedFromRegistry-RDF', rdfFilePath: "test/rdfs-examples/parse-tests-rdfs/0e4cb692DataAuth-parse-ScopeOfAuth-SelectedFromRegistry.ttl", instance: ExampleInstances.dataAuthorization0e4cb692ScopeOfAuthSelectedFromRegistry},
    { name: 'Test-Grantee-application-agent-RDF', rdfFilePath: "test/rdfs-examples/parse-tests-rdfs/0e4cb692DataAuth-parse-grantee-application-agent.ttl", instance: ExampleInstances.dataAuthorization0e4cb692Parse},
    { name: 'Test-Grantee-social-agent-RDF', rdfFilePath: "test/rdfs-examples/parse-tests-rdfs/0e4cb692DataAuth-parse-grantee-social-agent.ttl", instance: ExampleInstances.dataAuthorization0e4cb692ParseSocialAgentGrantee}
])('Test-fromRdftoAccessAuthorization', async (arg) => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const args: Map<string, any> | Error = await new RdfFactory().parse(fetch, arg.rdfFilePath);
    if (args instanceof Error) {
        fail(args)
    }
    const dataAuthorization: DataAuthorization = DataAuthorization.makeDataAuthorization(args);

    expect(dataAuthorization).toStrictEqual(arg.instance);
})

test.each([
    { name: "Test-parse-ApplicationRegistration-2f2f3628", rdfFilePath: "test/rdfs-examples/parse-tests-rdfs/2f2f3628ApplicationRegistration-parse/2f2f3628.ttl", instance: ExampleInstances.applicationRegistration2f2f3628 }
])("Test-parse-ApplicationRegistration", async (arg) => {
    const args: Map<string, any> | Error = await new RdfFactory().parse(fetch, arg.rdfFilePath);
    if (args instanceof Error) {
        fail(args)
    }
    const applicationRegistration: ApplicationRegistration = ApplicationRegistration.makeApplicationRegistration(args);

    expect(applicationRegistration).toStrictEqual(arg.instance);
})

test('Test-unparseable-RDF', async () => {
    const faultyPath: string = "test/rdfs-examples/parse-tests-rdfs/Faulty.ttl";
    new RdfFactory().parse(fetch, faultyPath)
        .then(() => fail("Should not be able ot parse file: " + faultyPath))
        .catch((e) => expect(e instanceof NotParsable).toStrictEqual(true));
})

test.each([
    { name: 'Test-unparseable-missing-date-RDF', faultyPath: "test/rdfs-examples/parse-tests-rdfs/47e07897AccessAuth-parse-faulty-date1.ttl"},
    { name: 'Test-unparseable-invalid-date-RDF', faultyPath: "test/rdfs-examples/parse-tests-rdfs/47e07897AccessAuth-parse-faulty-date2.ttl"}
])('Test-fromRdftoAccessAuthorization', async (arg) => {
    new RdfFactory().parse(fetch, arg.faultyPath)
        .then(() => fail("Should not be able ot parse file: " + arg.faultyPath))
        .catch((e) => expect(e instanceof InvalidDate).toStrictEqual(true));
})

test('Test-unparseable-access-mode-RDF', async () => {
    const faultyPath: string = "test/rdfs-examples/parse-tests-rdfs/0e4cb692DataAuth-parse-faulty-access-mode.ttl";
    new RdfFactory().parse(fetch, faultyPath)
        .then(() => fail("Should not be able ot parse file: " + faultyPath))
        .catch((e) => expect(e instanceof InvalidAccessMode).toStrictEqual(true));
})

test('Test-unparseable-not-implemented-pred-RDF', async () => {
    const faultyPath: string = "test/rdfs-examples/parse-tests-rdfs/47e07897AccessAuth-parse-non-implemented-pred.ttl";
    new RdfFactory().parse(fetch, faultyPath)
        .then(() => fail("Should not be able ot parse file: " + faultyPath))
        .catch((e) => expect(e instanceof NotImplementedYet).toStrictEqual(true));
})