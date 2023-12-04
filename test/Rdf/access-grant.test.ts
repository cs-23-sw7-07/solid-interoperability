import {getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot} from "@inrupt/internal-test-env";
import {Session} from "@inrupt/solid-client-authn-node";
import {
    AccessGrant,
    DataAuthorization,
    DataGrant,
    getResource,
    getResources,
    SAIViolationMissingTripleError
} from "../../src";

describe("AccessGrant - test get and set methods/properties", () => {
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

    describe("AccessGrant", () => {
        let access: AccessGrant;

        beforeAll(async () => {
            const id = pod + "registries/agents/2f2f3628ApplicationRegistration/e2765d6dAccessGrant";
            access = await getResource(AccessGrant, session.fetch, id);
        });

        test("Unit test: AccessGrant - getHasDataGrant", async () => {
            const uris = [pod + "registries/agents/2f2f3628ApplicationRegistration/f54a1b6a0DataGrant", pod + "registries/agents/2f2f3628ApplicationRegistration/f0e4cb692DataGrant"];
            const dataGrants: DataGrant[] = await getResources(DataGrant, session.fetch, uris);
            expect(await access.getHasDataGrant()).toStrictEqual(dataGrants)
        })
    })

    describe("Missing Predicates hasDataGrant", () => {
        let access: AccessGrant;

        beforeAll(async () => {
            const id = pod + "test-unchangeable/wrong-rdfs/wrongAccessGrant";
            access = await getResource(AccessGrant, session.fetch, id);
        });

        test("Unit test: AccessGrant - hasDataGrant", () => {
            expect(async () => {await access.getHasDataGrant()}).rejects.toThrow(SAIViolationMissingTripleError)
        })
    })
})