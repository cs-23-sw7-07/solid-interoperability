import {getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot} from "@inrupt/internal-test-env";
import {Session} from "@inrupt/solid-client-authn-node";
import {AccessMode, ApplicationAgent, DataAuthorization, getResource, SAIViolationMissingTripleError} from "../../src";
import {AccessNeed} from "../../src";

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

    describe("DataAuthorization", () => {
        let access: DataAuthorization;

        beforeAll(async () => {
            const id = pod + "registries-unchangeable/authorization/f54a1b6a0DataAuth";
            access = await getResource(DataAuthorization, session.fetch, id);
        });

        test("Unit test: DataAuthorization - get Grantee", async () => {
            const expectedGrantee: ApplicationAgent = new ApplicationAgent("http://localhost:3000/Alice-pod/profile-documents/projectron#id");
            expect(await access.getGrantee()).toStrictEqual(expectedGrantee)
        })

        test("Unit test: DataAuthorization - get RegisteredShapeTree", () => {
            const expectedRegisteredShapeTree: string = "http://shapetrees.example/solid/Project";
            expect(access.RegisteredShapeTree).toStrictEqual(expectedRegisteredShapeTree)
        })

        test("Unit test: DataAuthorization - getSatisfiesAccessNeed", async () => {
            const expectedSatisfiesAccessNeed: AccessNeed = await getResource(AccessNeed, session.fetch, pod + "profile-documents/projectron#need-project");
            expect(await access.getSatisfiesAccessNeed()).toStrictEqual(expectedSatisfiesAccessNeed)
        })

        test("Unit test: DataAuthorization - get AccessMode", () => {
            const expectedAccessModes: AccessMode[] = [AccessMode.Read, AccessMode.Create];
            expect(access.AccessMode).toStrictEqual(expectedAccessModes)
        })

        test("Unit test: DataAuthorization - get CreatorAccessMode", () => {
            const expectedCreatorAccessModes: AccessMode[] = [AccessMode.Update, AccessMode.Delete];
            expect(access.CreatorAccessMode).toStrictEqual(expectedCreatorAccessModes)
        })
    })

    describe("Missing Predicate in DataAuthorization", () => {
        describe("Missing Predicates Grantee and RegisteredShapeTree", () => {
            let access: DataAuthorization;

            beforeAll(async () => {
                const id = pod + "test-unchangeable/wrong-rdfs/wrongDataAuth1";
                access = await getResource(DataAuthorization, session.fetch, id);
            });
    
            test("Unit test:  - get Grantee", () => {
                expect(() => access.getGrantee()).rejects.toThrow(SAIViolationMissingTripleError)
            })

            test("Unit test:  - get RegisteredShapeTree", () => {
                expect(() => {access.RegisteredShapeTree}).toThrow(SAIViolationMissingTripleError)
            })
        })

        describe("Missing Predicates AccessMode and CreatorAccessMode and method SatisfiesAccessNeed", () => {
            let access: DataAuthorization;

            beforeAll(async () => {
                const id = pod + "test-unchangeable/wrong-rdfs/wrongDataAuth2";
                access = await getResource(DataAuthorization, session.fetch, id);
            });

            test("Unit test:  - getSatisfiesAccessNeed", () => {
                expect(async () => {await access.getSatisfiesAccessNeed()}).rejects.toThrow(SAIViolationMissingTripleError)
            })

            test("Unit test:  - get AccessMode", () => {
                expect(() => {access.AccessMode}).toThrow(SAIViolationMissingTripleError)
            })

            test("Unit test:  - get CreatorAccessMode", () => {
                expect(access.CreatorAccessMode).toStrictEqual([]);
            })
        })
    })
})