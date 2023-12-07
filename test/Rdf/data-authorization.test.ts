import {getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot} from "@inrupt/internal-test-env";
import {Session} from "@inrupt/solid-client-authn-node";
import {
    AccessMode,
    AccessNeed,
    Agent,
    DataAuthorization,
    DataGrant,
    DataRegistration,
    getResource,
    GrantScope,
    IDataGrantBuilder,
    SAIViolationError,
    SAIViolationMissingTripleError,
    SocialAgent
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
            const id = pod + "registries-unchangeable/authorization/f54a1b6a0DataAuth";
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
            const data = await getResource(DataAuthorization, session.fetch, pod + "registries-unchangeable/authorization/f0e4cb692DataAuth");
            const expected: DataAuthorization = await getResource(DataAuthorization, session.fetch, pod + "registries-unchangeable/authorization/f54a1b6a0DataAuth");
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
                return pod + "registries-unchangeable/agents/2f2f3628ApplicationRegistration/f54a1b6a0DataGrant12345";
            }

            getAllDataRegistrations(_registeredShapeTree: string, _dataOwner?: SocialAgent): Promise<DataRegistration[]> {
                return Promise.reject([]);
            }

            getInheritedDataGrants(_auth: DataAuthorization): Promise<DataGrant[]> {
                return Promise.reject([]);
            }

        }

        test("Unit test: Data authorization to Data grant", async () => {
            const expected = await getResource(DataGrant, session.fetch, pod + "registries-unchangeable/agents/2f2f3628ApplicationRegistration/f54a1b6a0DataGrant");

            const auth = await getResource(DataAuthorization, session.fetch, pod + "registries-unchangeable/authorization/f54a1b6a0DataAuth");

            const actuals = await auth.toDataGrant(new MockBuilder());
            expect(actuals.length).toEqual(1);
            const actual = actuals[0];
            expect(await actual.getGrantee()).toStrictEqual(await expected.getGrantee());
            expect(actual.RegisteredShapeTree).toStrictEqual(expected.RegisteredShapeTree);
            expect(actual.getSatisfiesAccessNeed()).toStrictEqual(expected.getSatisfiesAccessNeed());
            expect(actual.AccessMode).toStrictEqual(expected.AccessMode);
            expect(actual.ScopeOfGrant).toStrictEqual(expected.ScopeOfGrant);
            expect(actual.DataOwner).toStrictEqual(expected.DataOwner);
            expect(actual.getHasDataRegistration()).toStrictEqual(expected.getHasDataRegistration());
            expect(actual.CreatorAccessMode).toStrictEqual(expected.CreatorAccessMode);
            expect(actual.HasDataInstance).toStrictEqual(expected.HasDataInstance);
        })
    })
})

describe("Testing pod communication for Data Authorization", () => {
    let session: Session;
    let pod: string

    beforeAll(async () => {
        const env = getNodeTestingEnvironment()
        session = await getAuthenticatedSession(env)
        pod = await getPodRoot(session);
    });
    
    test("Data Authorization - scopeOfGrant All/AllFromAgent/AllFromReg/SelectedFromReg/Inherited", async () => {
        const id: string = pod + "test-created/dataAuth1";
        const grantee: Agent = new SocialAgent("http://localhost:3000/Alice-pod/profile/card#me");
        const RegisteredShapeTree: string = "http://shapetrees.example/solid/Project";
        const satisfiesAccessNeed: AccessNeed = await getResource(AccessNeed, session.fetch, pod + "profile-documents/projectron#need-project");
        const accessMode: AccessMode[] = [AccessMode.Read];
        
        await DataAuthorization.new(id, session.fetch, grantee, RegisteredShapeTree, satisfiesAccessNeed, accessMode, GrantScope.All);
        
        const addedAuth = await getResource(DataAuthorization, session.fetch, id)
        expect(addedAuth.uri).toStrictEqual(id)
        expect(await addedAuth.getGrantee()).toStrictEqual(grantee)
        expect(addedAuth.RegisteredShapeTree).toStrictEqual(RegisteredShapeTree)
        expect(await addedAuth.getSatisfiesAccessNeed()).toStrictEqual(satisfiesAccessNeed)
        expect(addedAuth.AccessMode).toStrictEqual(accessMode)
        expect(addedAuth.ScopeOfAuthorization).toStrictEqual(GrantScope.All)
    })
})