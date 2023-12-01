import {getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot} from "@inrupt/internal-test-env";
import {Session} from "@inrupt/solid-client-authn-node";
import {AccessGrant, ApplicationAgent, ApplicationRegistration, Fetch, getResource, SocialAgent} from "../../src";

describe("Agent-registration - test get and set methods/properties", () => {
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

    describe("Application Registration", async () => {
        const id: string = pod + "test-unchangedable/2f2f3628ApplicationRegistration/";


        test("Unit test: Application Registration - get RegisteredBy", async () => {
            const expectedRegisteredBy: SocialAgent = new SocialAgent("http://localhost:3000/Alice-pod/profile/card#me");

            const reg = await getResource(ApplicationRegistration, session.fetch, id)

            expect(reg.RegisteredBy).toStrictEqual(expectedRegisteredBy)
        })

        test("Unit test: Application Registration - get RegisteredWith", async () => {
            const id: string = pod + "test-unchangedable/2f2f3628ApplicationRegistration/";
            const registeredWith: ApplicationAgent = new ApplicationAgent("http://localhost:3000/test-unchangedable/authorization-agent#id");

            const reg = await getResource(ApplicationRegistration, session.fetch, id)

            expect(reg.RegisteredWith).toStrictEqual(registeredWith)
        })

        test("Unit test: Application Registration - get RegisteredBy", async () => {
            const id: string = pod + "test-unchangedable/2f2f3628ApplicationRegistration/";
            const registeredWith: ApplicationAgent = new ApplicationAgent("http://localhost:3000/test-unchangedable/authorization-agent#id");

            const reg = await getResource(ApplicationRegistration, session.fetch, id)

            expect(reg.RegisteredWith).toStrictEqual(registeredWith)
        })
    })













})