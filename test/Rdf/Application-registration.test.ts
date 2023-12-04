import {getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot} from "@inrupt/internal-test-env";
import {Session} from "@inrupt/solid-client-authn-node";
import {AccessGrant, ApplicationAgent, ApplicationRegistration, Fetch, getResource, SocialAgent} from "../../src";

describe("Application-registration-test", () => {
    let session: Session;
    let pod: string

    beforeAll(async () => {
        const env = getNodeTestingEnvironment()
        session = await getAuthenticatedSession(env)
        pod = await getPodRoot(session);
    });

    afterAll(async () => {
        await session.logout()
    });

    // test("Able to add a Application Registration", async () => {
    //     const accessGrant = await getResource(AccessGrant, session.fetch, pod + "e2765d6dAccessGrant")
    //     const id: string = pod + "applicationRegistration1/";
    //     const registeredBy: SocialAgent = new SocialAgent("http://localhost:3000/Alice-pod/profile/card#me");
    //     const registeredWith: ApplicationAgent = new ApplicationAgent("http://localhost:3000/test")
    //     const registeredAgent: ApplicationAgent = new ApplicationAgent("http://localhost:3000/projectron/#id");
    //     const hasAccessGrant: AccessGrant[] = [accessGrant];

    //     await ApplicationRegistration.new(id, session.fetch, registeredBy, registeredWith, registeredAgent, hasAccessGrant);
        
    //     const addedRegistration = await getResource(ApplicationRegistration, session.fetch, id)
    //     expect(addedRegistration.uri).toStrictEqual(id)
    //     expect(addedRegistration.RegisteredBy).toStrictEqual(registeredBy)
    //     expect(addedRegistration.RegisteredWith).toStrictEqual(registeredWith)
    //     expect(addedRegistration.RegisteredAgent).toStrictEqual(registeredAgent)
    //     expect(await addedRegistration.getHasAccessGrants()).toStrictEqual(hasAccessGrant)
    // })

    describe("Application Registration - test properties and methods", () => {
        let reg: ApplicationRegistration;

        beforeAll(async () => {
            const id = pod + "registries/agents/2f2f3628ApplicationRegistration/";
            reg = await getResource(ApplicationRegistration, session.fetch, id);
        });

        test("Unit test: Application Registration - get RegisteredAgent", () => {
            const registeredAgent: ApplicationAgent = new ApplicationAgent("http://localhost:3000/projectron/#id");
            expect(reg.RegisteredAgent).toStrictEqual(registeredAgent)
        })

        /* missing add AccessGrant test */
    })














})