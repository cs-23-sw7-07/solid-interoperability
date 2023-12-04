import {getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot} from "@inrupt/internal-test-env";
import {Session} from "@inrupt/solid-client-authn-node";
import {
    DataAuthorization,
    getResource,
    SAIViolationMissingTripleError,
    SocialAgent,
    GrantScope,
    DataRegistration,
    SAIViolationError,
    DataGrant, IDataGrantBuilder
} from "../../src";

describe("DataAuthorization - test get and set methods/properties", () => {
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

    describe("DataAuthorization", () => {
        let data: DataAuthorization;

        beforeAll(async () => {
            const id = pod + "registries/authorization/f54a1b6a0DataAuth";
            data = await getResource(DataAuthorization, session.fetch, id);
        });

        test("Unit test: DataAuthorization - get ScopeOfAuthorization", () => {
            const expectedScopeOfAuthorization: GrantScope = GrantScope.SelectedFromRegistry;
            expect(data.ScopeOfAuthorization).toStrictEqual(expectedScopeOfAuthorization)
        })

        test("Unit test: DataAuthorization - get DataOwner", () => {
            const expected: SocialAgent = new SocialAgent("http://localhost:3000/Alice-pod/profile/card#me");
            expect(data.DataOwner).toStrictEqual(expected)
        })

        test("Unit test: DataAuthorization - getHasDataRegistration", async () => {
            const expected: DataRegistration = await getResource(DataRegistration, session.fetch, pod + "data/8501f084DataRegistration/");
            expect(await data.getHasDataRegistration()).toStrictEqual(expected)
        })

        test("Unit test: DataAuthorization - get HasDataInstance", () => {
            const expected: string[] = ["http://localhost:3000/Alice-pod/data/8501f084DataRegistration/123"];
            expect(data.HasDataInstance).toStrictEqual(expected)
        })

        test("Unit test: DataAuthorization - getInheritsFromAuthorization", async () => {
            const data = await getResource(DataAuthorization, session.fetch, pod + "registries/authorization/f0e4cb692DataAuth");
            const expected: DataAuthorization = await getResource(DataAuthorization, session.fetch, pod + "registries/authorization/f54a1b6a0DataAuth");
            expect(await data.getInheritsFromAuthorization()).toStrictEqual(expected)
        })
    })

    describe("DataAuthorization - calling dataOwner with wrong scope of authorization", () => {
        test("Unit test: DataAuthorization - get DataOwner with wrong scope of authorization as All", async () => {
            const data = await getResource(DataAuthorization, session.fetch, pod + "test-unchangeable/wrong-rdfs/wrongDataAuthPredicates/wrongDataAuthdata1");
            expect(() => {data.DataOwner}).toThrow(SAIViolationError)
            expect(() => {data.DataOwner}).toThrow("Since the scope of authorization is " + GrantScope.All + " it has no data owner property.")
        })
    })

    describe("DataAuthorization - calling getHasDataRegistration with wrong scope of authorization", () => {
        test("Unit test: DataAuthorization - getHasDataRegistration with wrong scope of authorization as All", async () => {
            const data = await getResource(DataAuthorization, session.fetch, pod + "test-unchangeable/wrong-rdfs/wrongDataAuthPredicates/wrongDataAuthHasDataAuth1");
            await expect(async () => await data.getHasDataRegistration()).rejects.toThrow(SAIViolationError)
            await expect(async () => await data.getHasDataRegistration()).rejects.toThrow("Since the scope of authorization is " + GrantScope.All + " it has no data registration attacted.")
        })

        test("Unit test: DataAuthorization - getHasDataRegistration with wrong scope of authorization as AllFromAgent", async () => {
            const data = await getResource(DataAuthorization, session.fetch, pod + "test-unchangeable/wrong-rdfs/wrongDataAuthPredicates/wrongDataAuthHasDataAuth2");
            await expect(async () => await data.getHasDataRegistration()).rejects.toThrow(SAIViolationError)
            await expect(async () => await data.getHasDataRegistration()).rejects.toThrow("Since the scope of authorization is " + GrantScope.AllFromAgent + " it has no data registration attacted.")
        })
    })

    describe("DataAuthorization - calling HasDataInstance with wrong scope of authorization", () => {
        test("Unit test: DataAuthorization - HasDataInstance with wrong scope of authorization as All", async () => {
            const data = await getResource(DataAuthorization, session.fetch, pod + "test-unchangeable/wrong-rdfs/wrongDataAuthPredicates/wrongDataAuthHasDataAuth1");
            expect(() => {data.HasDataInstance}).toThrow(SAIViolationError)
            expect(() => {data.HasDataInstance}).toThrow("Since the scope of authorization is " + GrantScope.All + " it has no data instance attacted.")
        })

        test("Unit test: DataAuthorization - HasDataInstance with wrong scope of authorization as AllFromAgent", async () => {
            const data = await getResource(DataAuthorization, session.fetch, pod + "test-unchangeable/wrong-rdfs/wrongDataAuthPredicates/wrongDataAuthHasDataAuth2");
            expect(() => {data.HasDataInstance}).toThrow(SAIViolationError)
            expect(() => {data.HasDataInstance}).toThrow("Since the scope of authorization is " + GrantScope.AllFromAgent + " it has no data instance attacted.")
        })
    })

    describe("DataAuthorization - calling getInheritsFromAuthorization with wrong scope of authorization", () => {
        test("Unit test: DataAuthorization - getInheritsFromAuthorization with wrong scope of authorization as All", async () => {
            const data = await getResource(DataAuthorization, session.fetch, pod + "test-unchangeable/wrong-rdfs/wrongDataAuthPredicates/wrongDataAuthHasDataAuth1");
            await expect(async () => data.getInheritsFromAuthorization()).rejects.toThrow(SAIViolationError)
            await expect(async () => data.getInheritsFromAuthorization()).rejects.toThrow("Since the scope of authorization is " + GrantScope.All + " it has no inherited authorization attacted.")
        })

        test("Unit test: DataAuthorization - getInheritsFromAuthorization with wrong scope of authorization as AllFromAgent", async () => {
            const data = await getResource(DataAuthorization, session.fetch, pod + "test-unchangeable/wrong-rdfs/wrongDataAuthPredicates/wrongDataAuthHasDataAuth2");
            await expect(async () => {
                await data.getInheritsFromAuthorization()
            }).rejects.toThrow(SAIViolationError)
            await expect(async () => {
                await data.getInheritsFromAuthorization()
            }).rejects.toThrow("Since the scope of authorization is " + GrantScope.AllFromAgent + " it has no inherited authorization attacted.")
        })
    })


    describe("Missing Predicate in DataAuthorization", () => {
        describe("Missing Predicates", () => {
            let access: DataAuthorization;

            beforeAll(async () => {
                const id = pod + "test-unchangeable/wrong-rdfs/wrongDataAuth3";
                access = await getResource(DataAuthorization, session.fetch, id);
            });
    
            test("Unit test: DataAuthorization - get ScopeOfAuthorization", () => {
                expect(() => {access.ScopeOfAuthorization}).toThrow(SAIViolationMissingTripleError)
            })

            test("Unit test: DataAuthorization - get DataOwner", () => {
                expect(() => {access.DataOwner}).toThrow(SAIViolationMissingTripleError)
            })

            test("Unit test: DataAuthorization - getHasDataRegistration", () => {
                expect(async () => {await access.getHasDataRegistration()}).rejects.toThrow(SAIViolationMissingTripleError)
            })

            test("Unit test: DataAuthorization - get HasDataInstance", () => {
                expect(() => {access.HasDataInstance}).toThrow(SAIViolationMissingTripleError)
            })

            test("Unit test: DataAuthorization - get getInheritsFromAuthorization", () => {
                expect(async () => await access.getInheritsFromAuthorization()).rejects.toThrow(SAIViolationMissingTripleError);
            })
        })
    })

    describe("Convert from authorization to grant", () => {

        class MockBuilder implements IDataGrantBuilder {
            generateId(): string {
                return pod + "registries/agents/2f2f3628ApplicationRegistration/f54a1b6a0DataGrant";
            }

            getAllDataRegistrations(registeredShapeTree: string, dataOwner?: SocialAgent): Promise<DataRegistration[]> {
                return Promise.reject([]);
            }

            getInheritedDataGrants(auth: DataAuthorization): Promise<DataGrant[]> {
                return Promise.reject([]);
            }

        }

        test("Unit test: Data authorization to Data grant", async () => {
            const expected = await getResource(DataGrant, session.fetch, pod + "registries/agents/2f2f3628ApplicationRegistration/f54a1b6a0DataGrant");

            const auth = await getResource(DataAuthorization, session.fetch, pod + "registries/authorization/f54a1b6a0DataAuth");

            const actual = await auth.toDataGrant(new MockBuilder());

            expect(actual[0]).toEqual(expected)
        })
    })
})