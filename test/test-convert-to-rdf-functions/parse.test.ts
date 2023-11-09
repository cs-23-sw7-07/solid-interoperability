import * as ExampleInstances from "../test-case";
import {RdfFactory} from "../../src/data-management/data-model/factory/rdfFactory";
import {AccessAuthorization} from "../../src/data-management/data-model/authorization/access-auhorization";
import {NotParsable} from "../../src/Errors/NotParsable";

test.each([
    { name: '47e07897', rdf_file_path: "test/rdfs-examples/parse-tests-rdfs/47e07897AccessAuth-parse.ttl", instance: ExampleInstances.accessAuthorizatione47e07897Parse },
])('Test-fromRdftoAccessAuthorization', async (arg) => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const args: Map<string, any> | Error = await new RdfFactory().parse(arg.rdf_file_path);
    if (args instanceof Error) {
        fail(args)
    }
    const accessAuthorization: AccessAuthorization = AccessAuthorization.makeAccessAuthorization(args);

    expect(accessAuthorization).toStrictEqual(arg.instance);
})

test('Test-unparseable-RDF', async () => {
    const faultyPath: string = "test/rdfs-examples/parse-tests-rdfs/Faulty.ttl";
    new RdfFactory().parse(faultyPath)
        .then(() => fail("Should not be able ot parse file: " + faultyPath))
        .catch((e) => expect(e instanceof NotParsable).toStrictEqual(true));
})