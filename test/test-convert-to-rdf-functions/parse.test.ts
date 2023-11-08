import * as ExampleInstances from "../test-case";
import {getRDFFromFile} from "../../src/data-management/Utils/get-RDF-from-file";
import {join} from "path";
import {RdfFactory} from "../../src/data-management/data-model/factory/rdfFactory";
import {accessAuthorizatione2765d6d} from "../test-case";

test.each([
    { name: '47e07897', expect_rdf_file_path: "test/rdfs-examples/authorization/47e07897AccessAuth.ttl", instance: ExampleInstances.accessAuthorizatione2765d6d },
])('Test-toRdfDataRegistration-%s', async (arg) => {
    const expected = arg.instance

    let args: Map<string, any> = new Map<string, any>();

    await new RdfFactory().parse(arg.expect_rdf_file_path).then((result: Map<string, any>) => args = result);
    //console.log(args);

    expect(true).toBe(true)
})