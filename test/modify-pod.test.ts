import {getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot} from "@inrupt/internal-test-env";
import {Session} from "@inrupt/solid-client-authn-node";
import {readParseResource, readResource} from "../src/data-management/Utils/modify-pod";
import {AccessGrant, ApplicationAgent, ApplicationRegistration, getResource, Rdf, SocialAgent} from "../src";

describe("modify-pod-test", () => {
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

    test("Smoke test: Able to get a resource", async () => {
        await readResource(session.fetch, pod + "profile/card#me")
    })

    test("Smoke test: Able to get a resource and parse", async () => {
        await readParseResource(session.fetch, pod + "profile/card#me")
    })

    test("Smoke test: Able to get a resource, parse, create Rdf object", async () => {
        await getResource(Rdf, session.fetch, pod + "profile/card#me")
    })

    test("Unit test: get a Application Registration resource, check it has the fields", async () => {
        const accessGrant = await getResource(AccessGrant, session.fetch, pod + "registries/agents/2f2f3628ApplicationRegistration/e2765d6dAccessGrant")
        const id: string = pod + "registries/agents/2f2f3628ApplicationRegistration/";
        const registeredBy: SocialAgent = new SocialAgent("http://localhost:3000/Alice-pod/profile/card#me");
        const registeredWith: ApplicationAgent = new ApplicationAgent("http://localhost:3000/Alice-pod/profile-documents/authorization-agent#id");
        const registeredAt: Date = new Date("2020-04-04T20:15:47.000Z");
        const updatedAt: Date = new Date("2020-04-04T21:11:33.000Z")
        const registeredAgent: ApplicationAgent = new ApplicationAgent("http://localhost:3000/Alice-pod/profile-documents/projectron#id");
        const hasAccessGrant: AccessGrant[] = [accessGrant];

        const reg = await getResource(ApplicationRegistration, session.fetch, id)

        expect(reg.uri).toStrictEqual(id)
        expect(reg.RegisteredBy).toStrictEqual(registeredBy)
        expect(reg.RegisteredWith).toStrictEqual(registeredWith)
        expect(reg.RegisteredAt).toStrictEqual(registeredAt)
        expect(reg.UpdatedAt).toStrictEqual(updatedAt)
        expect(reg.RegisteredAgent).toStrictEqual(registeredAgent)
        //expect(await reg.getHasAccessGrants()).toStrictEqual(hasAccessGrant)
    })








})