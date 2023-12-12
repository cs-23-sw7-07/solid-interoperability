import {getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot} from "@inrupt/internal-test-env";
import {Session} from "@inrupt/solid-client-authn-node";
import {
    AccessGrant,
    ApplicationRegistration,
    getResource,
    SAIViolationMissingTripleError,
    SocialAgentRegistration
} from "../../src";

describe("Agent registration - test get and set methods/properties", () => {
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

    describe("Application Registration", () => {
        let reg: ApplicationRegistration;

        beforeAll(async () => {
            const id = pod + "registries-unchangeable/agents/2f2f3628ApplicationRegistration/";
            reg = await getResource(ApplicationRegistration, session.fetch, id);
        });

        test("Unit test: Application Registration - getHasAccessGrants", async () => {
            const grant_iri = pod + "registries-unchangeable/agents/2f2f3628ApplicationRegistration/e2765d6dAccessGrant";
            const grant = await getResource(AccessGrant, session.fetch, grant_iri)
            const expectedGrants: AccessGrant[] = [grant]
            
            expect(await reg.getHasAccessGrants()).toStrictEqual(expectedGrants)
        })

        /* missing add AccessGrant test */
    })

    describe("Social Agent Registration", () => {
        let reg: SocialAgentRegistration;

        beforeAll(async () => {
            const id = pod + "registries-unchangeable/agents/c4562da9SocialAgentRegistration/";
            reg = await getResource(SocialAgentRegistration, session.fetch, id);
        });

        test("Unit test: Social Registration - getHasAccessGrants", async () => {
            const grant_iri = pod + "registries-unchangeable/agents/c4562da9SocialAgentRegistration/b6e125b8AccessGrant";
            const grant = await getResource(AccessGrant, session.fetch, grant_iri)
            const expectedGrants: AccessGrant[] = [grant]
            
            expect(await reg.getHasAccessGrants()).toStrictEqual(expectedGrants)
        })
    })

    describe("Missing Predicate in Registration", () => {
        describe("Missing Predicate hasAccessGrants", () => {
            let reg: ApplicationRegistration;
    
            beforeAll(async () => {
                const id = pod + "test-unchangeable/wrong-rdfs/wrongApplicationRegistration1/";
                reg = await getResource(ApplicationRegistration, session.fetch, id);
            });
    
            test("Unit test: Application Registration - getHasAccessGrants", async () => {
                expect(async () => {await reg.getHasAccessGrants()}).rejects.toThrow(SAIViolationMissingTripleError)
            })
        })
    })
})