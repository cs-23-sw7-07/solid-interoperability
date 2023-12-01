import {getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot} from "@inrupt/internal-test-env";
import {Session} from "@inrupt/solid-client-authn-node";
import {AccessGrant, ApplicationAgent, ApplicationRegistration, Fetch, getResource, SocialAgent} from "../../src";

describe("Application-registration-test", () => {
    let env;
    let session: Session;
    let pod: string

    beforeAll(async () => {
        env = getNodeTestingEnvironment()
        session = await getAuthenticatedSession(env)
        pod = await getPodRoot(session);
    });

    afterAll(async () => {
        await session.logout()
    });

    test("Able to add a Application Registration", async () => {
        const accessGrant = await getResource(AccessGrant, session.fetch, pod + "e2765d6dAccessGrant")
        const id: string = pod + "applicationRegistration1/";
        const registeredBy: SocialAgent = new SocialAgent("http://localhost:3000/Alice-pod/profile/card#me");
        const registeredWith: ApplicationAgent = new ApplicationAgent("http://localhost:3000/test")
        const registeredAgent: ApplicationAgent = new ApplicationAgent("http://localhost:3000/projectron/#id");
        const hasAccessGrant: AccessGrant[] = [accessGrant];

        await ApplicationRegistration.new(id, session.fetch, registeredBy, registeredWith, registeredAgent, hasAccessGrant);
        
        const addedRegistration = await getResource(ApplicationRegistration, session.fetch, id)
        expect(addedRegistration.uri).toStrictEqual(id)
        expect(addedRegistration.RegisteredBy).toStrictEqual(registeredBy)
        expect(addedRegistration.RegisteredWith).toStrictEqual(registeredWith)
        expect(addedRegistration.RegisteredAgent).toStrictEqual(registeredAgent)
        expect(await addedRegistration.getHasAccessGrants()).toStrictEqual(hasAccessGrant)
    })














})