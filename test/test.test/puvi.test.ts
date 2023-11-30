import { getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot } from "@inrupt/internal-test-env";
import { getResource } from "../../src"
import { ApplicationRegistration } from "../../src"
import { SocialAgent } from "../../src";
test('Test-unparseable-access-mode-RDF', async () => {
    const env = getNodeTestingEnvironment()
    const session = await getAuthenticatedSession(env);
    const pod = await getPodRoot(session);
    console.log(pod)
    const uri = "http://localhost:3000/Alice-pod/Registries/agentregisties/36fc364d-bef4-4554-b5be-b9c501801690/"
    const a = await getResource(ApplicationRegistration, session.fetch, uri)
    await a.setRegisteredBy(new SocialAgent("http://AAAAA.com/Alice"))
    
})
    