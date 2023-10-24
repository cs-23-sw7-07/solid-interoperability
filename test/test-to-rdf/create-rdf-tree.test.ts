import * as fs from 'fs';
const path = require('path')

import { readFileSync } from 'fs';
import { join } from 'path';

import { AccessGrant } from "../../src/data-management/data-model/access-authorization/access-grant"
import { AccessMode, DataGrant } from "../../src/data-management/data-model/access-authorization/data-grant"
import { SocialAgent } from "../../src/data-management/data-model/agent"
import { SocialAgentRegistration } from "../../src/data-management/data-model/agent-registration/social-agent-registration"
import { socialAgentRegistrationc4562da9 } from "../test-case"
import { ExportToRDF } from '../../src/data-management/rdf-handler/to-rdf';

test(
    "Test_SocialAgentRegistrationt_to_RDF_c4562da9", async () => {
        let expected_path = join(__dirname, "../test-cases/agents/c4562da9SocialAgentRegistration/c4562da9.ttl")
        
        let expected = readFileSync(expected_path, 'utf-8')

        let actual = await ExportToRDF.toRdfSocialAgentRegistration(socialAgentRegistrationc4562da9)

        expect(actual).toBe(expected)
    }
)

test(
    "Test_ApplicationAgentRegistrationt_to_RDF_c4562da9", async () => {
        let expected_path = join(__dirname, "../test-cases/agents/c4562da9SocialAgentRegistration/c4562da9.ttl")
        
        let expected = readFileSync(expected_path, 'utf-8')

        let actual = await ExportToRDF.toRdfSocialAgentRegistration(socialAgentRegistrationc4562da9)

        expect(actual).toBe(expected)
    }
)


  
