import {getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot} from "@inrupt/internal-test-env";
import {Session} from "@inrupt/solid-client-authn-node";
import {AccessAuthorization, ApplicationAgent, getResource, SAIViolationMissingTripleError, SocialAgent} from "../../src";
import { AccessNeedGroup } from "../../src";

describe(" - test get and set methods/properties", () => {
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

        test("Unit test: AccessAuthorization - get GrantedBy", () => {
            const expectedGrantedBy: SocialAgent = new SocialAgent("http://localhost:3000/Alice-pod/profile/card#me");
            expect(access.GrantedBy).toStrictEqual(expectedGrantedBy)
        })

        test("Unit test: AccessAuthorization - get GrantedAt", () => {
            const expectedGrantedAt: Date = new Date("2020-12-04T20:15:47.000Z");
            expect(access.GrantedAt).toStrictEqual(expectedGrantedAt)
        })

        test("Unit test: AccessAuthorization - get Grantee", async () => {
            const expectedGrantee: ApplicationAgent = new ApplicationAgent("http://localhost:3000/Alice-pod/profile-documents/projectron#id");
            expect(await access.getGrantee()).toStrictEqual(expectedGrantee)
        })

        test("Unit test: AccessAuthorization - getHasAccessNeedGroup", async () => {
            const expectedHasAccessNeedGroup: AccessNeedGroup = await getResource(AccessNeedGroup, session.fetch, "http://localhost:3000/Alice-pod/profile-documents/projectron#need-group-pm");
            expect(await access.getHasAccessNeedGroup()).toStrictEqual(expectedHasAccessNeedGroup)
        })
    })

    describe("Missing Predicate in AccessAuthorization", () => {
        describe("Missing Predicates GrantedBy and GrantedWith", () => {
            let access: AccessAuthorization;

            beforeAll(async () => {
                const id = pod + "test-unchangeable/wrong-rdfs/wrongAccessAuth1";
                access = await getResource(AccessAuthorization, session.fetch, id);
            });
    
            test("Unit test:  - get GrantedBy", () => {
                expect(() => access.GrantedBy).toThrow(SAIViolationMissingTripleError)
            })
        })

        describe("Missing Predicates GrantedAt and Grantee and method getHasAccessNeedGroup", () => {
            let access: AccessAuthorization;

            beforeAll(async () => {
                const id = pod + "test-unchangeable/wrong-rdfs/wrongAccessAuth2";
                access = await getResource(AccessAuthorization, session.fetch, id);
            });

            test("Unit test:  - get GrantedAt", () => {
                expect(() => access.GrantedAt).toThrow(SAIViolationMissingTripleError)
            })
    
            test("Unit test:  - get Grantee", () => {
                expect(() => access.getGrantee()).rejects.toThrow(SAIViolationMissingTripleError)
            })

            test("Unit test:  - getHasAccessNeedGroup", () => {
                expect(async () => {await access.getHasAccessNeedGroup()}).rejects.toThrow(SAIViolationMissingTripleError)
            })
        })
    })
})