import * as fs from 'fs';
const path = require('path')

import { readFileSync } from 'fs';
import { join } from 'path';

import { AccessGrant } from "../../src/data-management/data-model/access-authorization/access-grant"
import { AccessMode, DataGrant } from "../../src/data-management/data-model/access-authorization/data-grant"
import { SocialAgent } from "../../src/data-management/data-model/agent"
import { SocialAgentRegistration } from "../../src/data-management/data-model/agent-registration/social-agent-registration"
import { ExportToRDF } from "../../src/data-management/rdf-handler/to-rdf"
import { socialAgentRegistrationc4562da9 } from "../test-case"

test(
    "ToRdfSocialAgentRegistrationtc4562da9",
    async () => expect(await new ExportToRDF().toRdfSocialAgentRegistration(socialAgentRegistrationc4562da9)).toBe(readFileSync(join(__dirname, "../test-cases/agents/c4562da9SocialAgentRegistration/c4562da9.ttl"), 'utf-8'))
)


  
