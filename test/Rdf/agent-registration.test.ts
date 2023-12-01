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

    describe("Application Registration", () => {
        let id: string;
        let reg: ApplicationRegistration;

        beforeAll(async () => {
            id = pod + "test-unchangedable/2f2f3628ApplicationRegistration/";
            reg = await getResource(ApplicationRegistration, session.fetch, id);
        });

        test("Unit test: Application Registration - get RegisteredBy", async () => {
            const expectedRegisteredBy: SocialAgent = new SocialAgent("http://localhost:3000/Alice-pod/profile/card#me");
            expect(reg.RegisteredBy).toStrictEqual(expectedRegisteredBy)
        })

        test("Unit test: Application Registration - get RegisteredWith", async () => {
            const registeredWith: ApplicationAgent = new ApplicationAgent("http://localhost:3000/test-unchangedable/authorization-agent#id");
            expect(reg.RegisteredWith).toStrictEqual(registeredWith)
        })

        test("Unit test: Application Registration - get registeredAt", async () => {
            const registeredAt: Date = new Date("2020-04-04T20:15:47.000Z");
            expect(reg.RegisteredAt).toStrictEqual(registeredAt)
        })

        test("Unit test: Application Registration - get updatedAt", async () => {
            const updatedAt: Date = new Date("2020-04-04T21:11:33.000Z")
            expect(reg.UpdatedAt).toStrictEqual(updatedAt)
        })
    })













})