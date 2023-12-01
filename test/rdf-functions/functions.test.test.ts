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

    test("Able to get a resource", async () => {
        const accessGrant = await getResource(AccessGrant, session.fetch, pod + "e2765d6dAccessGrant")
    })












})