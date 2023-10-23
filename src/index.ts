import { AccessGrant } from './data-management/data-model/access-authorization/access-grant';
import { SocialAgent } from './data-management/data-model/agent';
import { SocialAgentRegistration } from './data-management/data-model/agent-registration/social-agent-registration';
import {ExportToRDF} from './data-management/rdf-handler/to-rdf'

export * from './authentication/authentication';


export function hello(){
    return "hello"
}