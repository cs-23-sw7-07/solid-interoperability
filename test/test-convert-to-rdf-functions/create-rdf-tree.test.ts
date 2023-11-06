const path = require('path')

import { readFileSync } from 'fs';
import { join } from 'path';

import { accessAuthorizationd577d117, accessAuthorizatione2765d6c, accessAuthorizatione47e07897, accessGrant27eae14b, accessGrantb6e125b8, applicationRegistration2f2f3628, dataAuthorization0e4cb692, dataAuthorization54a1b6a0, dataGrant0945218b, dataGrant40d038ea, dataGrant95ff7580, dataGrantb42228af, dataRegistration8501f084, dataRegistrationdf4ab227, socialAgentRegistrationc4562da9 } from "../test-case"
import { RdfFactory } from '../../src/data-management/data-model/factory/rdfFactory';


const PATH_TO_RDFS_EXAMPLES = join(__dirname, "../rdfs-examples")

function getExpectedRDFFromFile(path: string): string {
    return readFileSync(join(PATH_TO_RDFS_EXAMPLES, path), 'utf-8')
}

test(
    "Test-toRdfSocialAgentRegistration-c4562da9", async () => {
        let expected = getExpectedRDFFromFile("agents/c4562da9SocialAgentRegistration/c4562da9.ttl")

        let actual = await new RdfFactory().create(socialAgentRegistrationc4562da9)

        expect(actual).toBe(expected)
    }
)

test(
    "Test-toRdfApplicationRegistration-2f2f3628", async () => {
        let expected = getExpectedRDFFromFile("agents/2f2f3628ApplicationRegistration/2f2f3628.ttl")

        let actual = await new RdfFactory().create(applicationRegistration2f2f3628)

        expect(actual).toBe(expected)
    }
)

test.each([
    { name: '8501f084', expect_rdf_file_path: "data/8501f084DataRegistration/8501f084.ttl", instance: dataRegistration8501f084 },
    { name: 'df4ab227', expect_rdf_file_path: "data/df4ab227DataRegistration/df4ab227.ttl", instance: dataRegistrationdf4ab227 }
])('Test-toRdfDataRegistration-%s', async (arg) => {
    let expected = getExpectedRDFFromFile(arg.expect_rdf_file_path)

    let actual = await new RdfFactory().create(arg.instance)

    expect(actual).toBe(expected)
})

test.each([
    { name: '40d038ea', expect_rdf_file_path: "agents/2f2f3628ApplicationRegistration/40d038eaDataGrant.ttl", instance: dataGrant40d038ea },
    { name: '0945218b', expect_rdf_file_path: "agents/2f2f3628ApplicationRegistration/0945218bDataGrant.ttl", instance: dataGrant0945218b },
    { name: '95ff7580', expect_rdf_file_path: "agents/c4562da9SocialAgentRegistration/95ff7580DataGrant.ttl", instance: dataGrant95ff7580 },
    { name: 'b42228af', expect_rdf_file_path: "agents/c4562da9SocialAgentRegistration/b42228afDataGrant.ttl", instance: dataGrantb42228af }
])('Test-toRdfDataGrant-%s', async (arg) => {
    let expected = getExpectedRDFFromFile(arg.expect_rdf_file_path)

    let actual = await new RdfFactory().create(arg.instance)

    expect(actual).toBe(expected)
})


test.each([
    { name: '27eae14b', expect_rdf_file_path: "agents/2f2f3628ApplicationRegistration/27eae14bAccessGrant.ttl", instance: accessGrant27eae14b },
    { name: 'b6e125b8', expect_rdf_file_path: "agents/c4562da9SocialAgentRegistration/b6e125b8AccessGrant.ttl", instance: accessGrantb6e125b8 },
])('Test-toRdfAccessGrant-%s', async (arg) => {
    let expected = getExpectedRDFFromFile(arg.expect_rdf_file_path)

    let actual = await new RdfFactory().create(arg.instance)

    expect(actual).toBe(expected)
})

test.each([
    { name: '0e4cb692', expect_rdf_file_path: "authorization/0e4cb692DataAuth.ttl", instance: dataAuthorization0e4cb692 },
    { name: '54a1b6a0', expect_rdf_file_path: "authorization/54a1b6a0DataAuth.ttl", instance: dataAuthorization54a1b6a0 },
])('Test-toRdfDataAuthorization-%s', async (arg) => {
    let expected = getExpectedRDFFromFile(arg.expect_rdf_file_path)

    let actual = await new RdfFactory().create(arg.instance)

    expect(actual).toBe(expected)
})

test.each([
    { name: 'e2765d6c', expect_rdf_file_path: "authorization/e2765d6cAccessAuth.ttl", instance: accessAuthorizatione2765d6c },
    { name: '47e07897', expect_rdf_file_path: "authorization/47e07897AccessAuth.ttl", instance: accessAuthorizatione47e07897 },
])('Test-toRdfDataAuthorization-%s', async (arg) => {
    let expected = getExpectedRDFFromFile(arg.expect_rdf_file_path)

    let actual = await new RdfFactory().create(arg.instance)

    expect(actual).toBe(expected)
})

test.each([
    { name: 'd577d117', expect_rdf_file_path: "authorization/d577d117AccessAuthorization.ttl", instance: accessAuthorizationd577d117 },
])('Test-createWithPrefixes-%s', async (arg) => {
    const PREFIXEStest = {
            rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
            rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
            xsd: 'http://www.w3.org/2001/XMLSchema#',
            acl: 'http://www.w3.org/ns/auth/acl#',
            interop: 'http://www.w3.org/ns/solid/interop#',
            alice: 'https://alice.example/',
            jarvis: 'https://jarvis.example/',
            'alice-authorization': 'https://alice.example/authorization/',
        }
    let expected = getExpectedRDFFromFile(arg.expect_rdf_file_path)

    let actual = await new RdfFactory().create(arg.instance, PREFIXEStest)

    expect(actual).toBe(expected)
})

test.each([
    { name: 'd577d117', expect_rdf_file_path: "authorization/d577d117AccessAuthorization.ttl", instance: accessAuthorizationd577d117 },
])('Test-createWithPrefixesAndDefault-%s', async (arg) => {
    const PREFIXEStest = {
            'alice': 'https://alice.example/',
            'jarvis': 'https://jarvis.example/',
            'alice-authorization': 'https://alice.example/authorization/',
        }
    let expected = getExpectedRDFFromFile(arg.expect_rdf_file_path)

    let actual = await new RdfFactory().create(arg.instance, PREFIXEStest)

    expect(actual).toBe(expected)
})