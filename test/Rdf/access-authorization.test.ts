import {getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot} from "@inrupt/internal-test-env";
import {Session} from "@inrupt/solid-client-authn-node";
import {AccessAuthorization, ApplicationAgent, DataAuthorization, getResource, getResources, SAIViolationMissingTripleError} from "../../src";

describe("AccessAuthorization - test get and set methods/properties", () => {
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

    describe("AccessAuthorization", () => {
        let access: AccessAuthorization;

        beforeAll(async () => {
            const id = pod + "registries/authorization/e2765d6cAccessAuthReplace";
            access = await getResource(AccessAuthorization, session.fetch, id);
        });

        test("Unit test: AccessAuthorization - get GrantedWith", () => {
            const expectedGrantedWith: ApplicationAgent = new ApplicationAgent("http://localhost:3000/Alice-pod/profile-documents/authorization-agent#id");
            expect(access.GrantedWith).toStrictEqual(expectedGrantedWith)
        })

        test("Unit test: AccessAuthorization - getHasDataAuthorization", async () => {
            const uris = [pod + "registries/authorization/f54a1b6a0DataAuth", pod + "registries/authorization/f0e4cb692DataAuth"];
            const dataAuthorizations: DataAuthorization[] = await getResources(DataAuthorization, session.fetch, uris);
            expect(await access.getHasDataAuthorization()).toStrictEqual(dataAuthorizations)
        })

        test("Unit test: AccessAuthorization - getReplaces", async () => {
            const expectedAccessAuthorization: AccessAuthorization = await getResource(AccessAuthorization, session.fetch, pod + "registries/authorization/e2765d6dAccessAuth");
            expect(await access.getReplaces()).toStrictEqual(expectedAccessAuthorization)
        })
    })


    describe("Replaces no authorization", () => {
        let access: AccessAuthorization;

        beforeAll(async () => {
            const id = pod + "test-unchangeable/wrong-rdfs/wrongAccessAuth2";
            access = await getResource(AccessAuthorization, session.fetch, id);
        });

        test("Unit test: AccessAuthorization - getReplaces", async () => {
            expect(await access.getReplaces()).toStrictEqual(undefined)
        })
    })

    describe("Missing Predicates hasDataAuthorization", () => {
        let access: AccessAuthorization;

        beforeAll(async () => {
            const id = pod + "test-unchangeable/wrong-rdfs/wrongAccessAuth2";
            access = await getResource(AccessAuthorization, session.fetch, id);
        });

        test("Unit test:  - get GrantedWith", () => {
            expect(() => {access.GrantedWith}).toThrow(SAIViolationMissingTripleError)
        })

        test("Unit test: AccessAuthorization - getHasDataAuthorization", () => {
            expect(async () => {await access.getHasDataAuthorization()}).rejects.toThrow(SAIViolationMissingTripleError)
        })
    })
})