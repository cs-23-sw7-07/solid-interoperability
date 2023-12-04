import {getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot} from "@inrupt/internal-test-env";
import {Session} from "@inrupt/solid-client-authn-node";
import {DataGrant, getResource, SAIViolationMissingTripleError, SocialAgent, GrantScope, DataRegistration, SAIViolationError} from "../../src";

describe("DataGrant - test get and set methods/properties", () => {
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

    describe("DataGrant", () => {
        let data: DataGrant;

        beforeAll(async () => {
            const id = pod + "registries/agents/2f2f3628ApplicationRegistration/f0e4cb692DataGrant";
            data = await getResource(DataGrant, session.fetch, id);
        });

        test("Unit test: DataGrant - get ScopeOfAuthorization", () => {
            const expectedScopeOfAuthorization: GrantScope = GrantScope.Inherited;
            expect(data.ScopeOfGrant).toStrictEqual(expectedScopeOfAuthorization)
        })

        test("Unit test: DataGrant - get DataOwner", () => {
            const expected: SocialAgent = new SocialAgent("http://localhost:3000/Alice-pod/profile/card#me");
            expect(data.DataOwner).toStrictEqual(expected)
        })

        test("Unit test: DataGrant - getHasDataRegistration", async () => {
            const expected: DataRegistration = await getResource(DataRegistration, session.fetch, pod + "data/1234567DataRegistration/");
            expect(await data.getHasDataRegistration()).toStrictEqual(expected)
        })

        test("Unit test: DataGrant - get HasDataInstance", async () => {
            const data = await getResource(DataGrant, session.fetch, pod + "registries/agents/2f2f3628ApplicationRegistration/f54a1b6a0DataGrant");
            const expected: string[] = ["http://localhost:3000/Alice-pod/data/8501f084DataRegistration/123"];
            expect(data.HasDataInstance).toStrictEqual(expected)
        })

        test("Unit test: DataGrant - getInheritsFromGrant", async () => {
            const expected: DataGrant = await getResource(DataGrant, session.fetch, pod + "registries/agents/2f2f3628ApplicationRegistration/f54a1b6a0DataGrant");
            expect(await data.getInheritsFromGrant()).toStrictEqual(expected)
        })
    })

    describe("DataGrant - calling HasDataInstance with wrong scope of grant", () => {
        test("Unit test: DataGrant - HasDataInstance with wrong scope of grant as All", async () => {
            const data = await getResource(DataGrant, session.fetch, pod + "test-unchangeable/wrong-rdfs/wrongDataGrant1");
            expect(() => {data.HasDataInstance}).toThrow(SAIViolationError)
            expect(() => {data.HasDataInstance}).toThrow("Since the scope of grant is " + GrantScope.All + " it has no data instance attacted.")
        })

        test("Unit test: DataGrant - HasDataInstance with wrong scope of grant as AllFromAgent", async () => {
            const data = await getResource(DataGrant, session.fetch, pod + "test-unchangeable/wrong-rdfs/wrongDataGrant2");
            expect(() => {data.HasDataInstance}).toThrow(SAIViolationError)
            expect(() => {data.HasDataInstance}).toThrow("Since the scope of grant is " + GrantScope.AllFromAgent + " it has no data instance attacted.")
        })
    })

    describe("DataGrant - calling getInheritsFromGrant with wrong scope of grant", () => {
        test("Unit test: DataGrant - getInheritsFromGrant with wrong scope of grant as All", async () => {
            const data = await getResource(DataGrant, session.fetch, pod + "test-unchangeable/wrong-rdfs/wrongDataGrant1");
            await expect(() =>
                data.getInheritsFromGrant()
            ).rejects.toThrow(SAIViolationError)
            await expect(() =>
                data.getInheritsFromGrant()
            ).rejects.toThrow("Since the scope of grant is " + GrantScope.All + " it has no inherited grant attacted.")
        })

        test("Unit test: DataGrant - getInheritsFromGrant with wrong scope of grant as AllFromAgent", async () => {
            const data = await getResource(DataGrant, session.fetch, pod + "test-unchangeable/wrong-rdfs/wrongDataGrant2");
            await expect(() =>
                data.getInheritsFromGrant()
            ).rejects.toThrow(SAIViolationError)
            await expect(() =>
                data.getInheritsFromGrant()
            ).rejects.toThrow("Since the scope of grant is " + GrantScope.AllFromAgent + " it has no inherited grant attacted.")
        })
    })


    describe("Missing Predicate in DataGrant", () => {
        describe("Missing Predicates", () => {
            let access: DataGrant;

            beforeAll(async () => {
                const id = pod + "test-unchangeable/wrong-rdfs/wrongDataGrant3";
                access = await getResource(DataGrant, session.fetch, id);
            });
    
            test("Unit test: DataGrant - get ScopeOfGrant", () => {
                expect(() => {access.ScopeOfGrant}).toThrow(SAIViolationMissingTripleError)
            })

            test("Unit test: DataGrant - get DataOwner", () => {
                expect(() => {access.DataOwner}).toThrow(SAIViolationMissingTripleError)
            })

            test("Unit test: DataGrant - getHasDataRegistration", () => {
                expect(async () => {await access.getHasDataRegistration()}).rejects.toThrow(SAIViolationMissingTripleError)
            })

            test("Unit test: DataGrant - get HasDataInstance", () => {
                expect(() => {access.HasDataInstance}).toThrow(SAIViolationMissingTripleError)
            })

            test("Unit test: DataGrant - get getInheritsFromGrant", () => {
                expect(async () => await access.getInheritsFromGrant()).rejects.toThrow(SAIViolationMissingTripleError);
            })
        })
    })
})