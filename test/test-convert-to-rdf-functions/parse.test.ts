import * as ExampleInstances from "../test-case";
import {RdfFactory} from "../../src/data-management/data-model/factory/rdfFactory";
import {AccessAuthorization} from "../../src/data-management/data-model/authorization/access-auhorization";

test.each([
    { name: '47e07897', expect_rdf_file_path: "test/rdfs-examples/parse-tests-rdfs/47e07897AccessAuth-parse.ttl", instance: ExampleInstances.accessAuthorizatione47e07897 },
])('Test-toRdfDataRegistration-%s', async (arg) => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const args: Map<string, any> = await new RdfFactory().parse(arg.expect_rdf_file_path);
    const accessAuthorization: AccessAuthorization = AccessAuthorization.makeAccessAuthorizationFromArgsMap(args);

    expect(accessAuthorization).toStrictEqual(arg.instance);
})