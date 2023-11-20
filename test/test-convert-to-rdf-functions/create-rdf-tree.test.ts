import { join } from 'path';
import { RdfFactory } from '../../src/data-management/data-model/factory/rdfFactory';
import * as ExampleInstances from '../test-case'
import { getRDFFromPath } from '../Utils/get-RDF'
import { test } from '@jest/globals';
import { AccessAuthorization } from '../../src/data-management/data-model/authorization/access/access-auhorization';
import { mock_fetch } from '../Utils/mock-fetch';

const PATH_TO_RDFS_EXAMPLES = join(__dirname, "../rdfs-examples")

test(
    "Test-toRdfSocialAgentRegistration-c4562da9", async () => {
        const expected = getRDFFromPath(join(PATH_TO_RDFS_EXAMPLES, "agents/c4562da9SocialAgentRegistration/c4562da9.ttl"))

        const actual = await new RdfFactory().create(ExampleInstances.socialAgentRegistrationc4562da9)

        expect(actual).toBe(expected)
    }
)

test(
    "Test-toRdfApplicationRegistration-2f2f3628", async () => {
        const expected = getRDFFromPath(join(PATH_TO_RDFS_EXAMPLES, "agents/2f2f3628ApplicationRegistration/2f2f3628.ttl"))

        const actual = await new RdfFactory().create(ExampleInstances.applicationRegistration2f2f3628)

        expect(actual).toBe(expected)
    }
)

test.each([
    { name: '8501f084', expect_rdf_file_path: "data/8501f084DataRegistration/8501f084.ttl", instance: ExampleInstances.dataRegistration8501f084 },
    { name: 'df4ab227', expect_rdf_file_path: "data/df4ab227DataRegistration/df4ab227.ttl", instance: ExampleInstances.dataRegistrationdf4ab227 }
])('Test-toRdfDataRegistration-%s', async (arg) => {
    const expected = getRDFFromPath(join(PATH_TO_RDFS_EXAMPLES, arg.expect_rdf_file_path))

    const actual = await new RdfFactory().create(arg.instance)

    expect(actual).toBe(expected)
})

test.each([
    { name: '40d038ea', expect_rdf_file_path: "agents/2f2f3628ApplicationRegistration/40d038eaDataGrant.ttl", instance: ExampleInstances.dataGrant40d038ea },
    { name: '0945218b', expect_rdf_file_path: "agents/2f2f3628ApplicationRegistration/0945218bDataGrant.ttl", instance: ExampleInstances.dataGrant0945218b },
    { name: '95ff7580', expect_rdf_file_path: "agents/c4562da9SocialAgentRegistration/95ff7580DataGrant.ttl", instance: ExampleInstances.dataGrant95ff7580 },
    { name: 'b42228af', expect_rdf_file_path: "agents/c4562da9SocialAgentRegistration/b42228afDataGrant.ttl", instance: ExampleInstances.dataGrantb42228af },
    { name: '2aa21a8c', expect_rdf_file_path: "agents/c4562da9SocialAgentRegistration/2aa21a8cDataGrant.ttl", instance: ExampleInstances.dataGrant2aa21a8c },
])('Test-toRdfDataGrant-%s', async (arg) => {
    const expected = getRDFFromPath(join(PATH_TO_RDFS_EXAMPLES, arg.expect_rdf_file_path))

    const actual = await new RdfFactory().create(arg.instance)

    expect(actual).toBe(expected)
})


test.each([
    { name: '27eae14b', expect_rdf_file_path: "agents/2f2f3628ApplicationRegistration/27eae14bAccessGrant.ttl", instance: ExampleInstances.accessGrant27eae14b },
    { name: 'b6e125b8', expect_rdf_file_path: "agents/c4562da9SocialAgentRegistration/b6e125b8AccessGrant.ttl", instance: ExampleInstances.accessGrantb6e125b8 },
])('Test-toRdfAccessGrant-%s', async (arg) => {
    const expected = getRDFFromPath(join(PATH_TO_RDFS_EXAMPLES, arg.expect_rdf_file_path))

    const actual = await new RdfFactory().create(arg.instance)

    expect(actual).toBe(expected)
})

test.each([
    { name: '0e4cb692', expect_rdf_file_path: "authorization/0e4cb692DataAuth.ttl", instance: ExampleInstances.dataAuthorization0e4cb692 },
    { name: '54a1b6a0', expect_rdf_file_path: "authorization/54a1b6a0DataAuth.ttl", instance: ExampleInstances.dataAuthorization54a1b6a0 },
    { name: '23a123bd', expect_rdf_file_path: "authorization/23a123bdDataAuth.ttl", instance: ExampleInstances.dataAuthorization23a123bd },
])('Test-toRdfDataAuthorization-%s', async (arg) => {
    const expected = getRDFFromPath(join(PATH_TO_RDFS_EXAMPLES, arg.expect_rdf_file_path))

    const actual = await new RdfFactory().create(arg.instance)

    expect(actual).toBe(expected)
})

test.each([
    { name: 'e2765d6c', expect_rdf_file_path: "authorization/e2765d6cAccessAuth.ttl", instance: ExampleInstances.accessAuthorizatione2765d6c },
    { name: 'e2765d6d', expect_rdf_file_path: "authorization/e2765d6dAccessAuth.ttl", instance: ExampleInstances.accessAuthorizatione2765d6d },
    { name: '47e07897', expect_rdf_file_path: "authorization/47e07897AccessAuth.ttl", instance: ExampleInstances.accessAuthorizatione47e07897 },
])('Test-toRdfDataAuthorization-%s', async (arg) => {
    const expected = getRDFFromPath(join(PATH_TO_RDFS_EXAMPLES, arg.expect_rdf_file_path))

    const actual = await new RdfFactory().create(arg.instance)

    expect(actual).toBe(expected)
})

test('AccessAuth-to-AccessGrant', async (path = join(PATH_TO_RDFS_EXAMPLES, "authorization/no-recursive-links/47e07897AccessAuth.ttl")) => {
    const expected = getRDFFromPath(join(PATH_TO_RDFS_EXAMPLES, "authorization/47e07897MOCKAccessGrant.ttl"))

    const factory = new RdfFactory()

    const params = await factory.parse(mock_fetch, path)
    if (params instanceof Error) {
        fail(params)
    }
    const actual = AccessAuthorization.makeAccessAuthorization(params)

    const content = await factory.create(actual.toAccessGrant())
    if (content instanceof Error) {
        fail(content)
    }
    expect(content).toBe(expected)
})
