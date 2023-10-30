import * as fs from 'fs';
const path = require('path')

import { readFileSync } from 'fs';
import { join } from 'path';

import { AccessGrant } from "../../src/data-management/data-model/access-authorization/access-grant"
import { AccessMode, DataGrant } from "../../src/data-management/data-model/access-authorization/data-grant"
import { SocialAgent } from "../../src/data-management/data-model/agent"
import { SocialAgentRegistration } from "../../src/data-management/data-model/agent-registration/social-agent-registration"
import { applicationRegistration2f2f3628, dataGrant0945218b, dataGrant40d038ea, dataGrant95ff7580, dataGrantb42228af, dataRegistration8501f084, dataRegistrationdf4ab227, socialAgentRegistrationc4562da9 } from "../test-case"
import { rdfFactory } from '../../src/data-management/data-model/factory/factory';


const PATH_TO_RDFS_EXAMPLES = join(__dirname, "../rdfs-examples")

function getExpectedRDFFromFile(path: string): string {
    return readFileSync(join(PATH_TO_RDFS_EXAMPLES, path), 'utf-8')
}

test(
    "Test-toRdfSocialAgentRegistration-c4562da9", async () => {
        let expected = getExpectedRDFFromFile("agents/c4562da9SocialAgentRegistration/c4562da9.ttl")

        let actual = await new rdfFactory().createRdf(socialAgentRegistrationc4562da9)

        expect(actual).toBe(expected)
    }
)

test(
    "Test-toRdfApplicationRegistration-2f2f3628", async () => {
        let expected = getExpectedRDFFromFile("agents/2f2f3628ApplicationRegistration/2f2f3628.ttl")

        let actual = await new rdfFactory().createRdf(applicationRegistration2f2f3628)

        expect(actual).toBe(expected)
    }
)

test.each([
    { name: '8501f084', expect_rdf_file_path: "data/8501f084DataRegistration/8501f084.ttl", instance: dataRegistration8501f084 },
    { name: 'df4ab227', expect_rdf_file_path: "data/df4ab227DataRegistration/df4ab227.ttl", instance: dataRegistrationdf4ab227 }
])('Test-toRdfDataRegistration-%s', async (arg) => {
    let expected = getExpectedRDFFromFile(arg.expect_rdf_file_path)

    let actual = await new rdfFactory().createRdf(arg.instance)

    expect(actual).toBe(expected)
})

test.each([
    { name: '40d038ea', expect_rdf_file_path: "agents/2f2f3628ApplicationRegistration/40d038eaDataGrant.ttl", instance: dataGrant40d038ea },
    { name: '0945218b', expect_rdf_file_path: "agents/2f2f3628ApplicationRegistration/0945218bDataGrant.ttl", instance: dataGrant0945218b },
    { name: '95ff7580', expect_rdf_file_path: "agents/c4562da9SocialAgentRegistration/95ff7580DataGrant.ttl", instance: dataGrant95ff7580 },
    { name: 'b42228af', expect_rdf_file_path: "agents/c4562da9SocialAgentRegistration/b42228afDataGrant.ttl", instance: dataGrantb42228af }
])('Test-toRdfDataGrant-%s', async (arg) => {
    let expected = getExpectedRDFFromFile(arg.expect_rdf_file_path)

    let actual = await new rdfFactory().createRdf(arg.instance)

    expect(actual).toBe(expected)
})

