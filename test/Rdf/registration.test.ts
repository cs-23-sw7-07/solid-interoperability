import {getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot} from "@inrupt/internal-test-env";
import {Session} from "@inrupt/solid-client-authn-node";
import {ApplicationAgent, ApplicationRegistration, getResource, SAIViolationMissingTripleError, SocialAgent, SocialAgentRegistration} from "../../src";

describe("registration - test get and set methods/properties", () => {
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
            const id = pod + "test-unchangeable/2f2f3628ApplicationRegistration/";
            reg = await getResource(ApplicationRegistration, session.fetch, id);
        });

        test("Unit test: Application Registration - get RegisteredBy", () => {
            const expectedRegisteredBy: SocialAgent = new SocialAgent("http://localhost:3000/Alice-pod/profile/card#me");
            expect(reg.RegisteredBy).toStrictEqual(expectedRegisteredBy)
        })

        test("Unit test: Application Registration - get RegisteredWith", () => {
            const registeredWith: ApplicationAgent = new ApplicationAgent("http://localhost:3000/test-unchangeable/authorization-agent#id");
            expect(reg.RegisteredWith).toStrictEqual(registeredWith)
        })

        test("Unit test: Application Registration - get registeredAt", () => {
            const registeredAt: Date = new Date("2020-04-04T20:15:47.000Z");
            expect(reg.RegisteredAt).toStrictEqual(registeredAt)
        })

        test("Unit test: Application Registration - get updatedAt", () => {
            const updatedAt: Date = new Date("2020-04-04T21:11:33.000Z")
            expect(reg.UpdatedAt).toStrictEqual(updatedAt)
        })
    })

    describe("Social Agent Registration", () => {
        let reg: SocialAgentRegistration;

        beforeAll(async () => {
            const id = pod + "test-unchangeable/c4562da9SocialAgentRegistration/";
            reg = await getResource(SocialAgentRegistration, session.fetch, id);
        });

        test("Unit test: Social Registration - get RegisteredBy", () => {
            const expectedRegisteredBy: SocialAgent = new SocialAgent("http://localhost:3000/Alice-pod/profile/card#me");
            const actualRegisteredBy = reg.RegisteredBy
            expect(actualRegisteredBy).toStrictEqual(expectedRegisteredBy)
        })

        test("Unit test: Social Registration - get RegisteredWith", () => {
            const registeredWith: ApplicationAgent = new ApplicationAgent("http://localhost:3000/test-unchangeable/authorization-agent123#id");
            expect(reg.RegisteredWith).toStrictEqual(registeredWith)
        })

        test("Unit test: Social Registration - get registeredAt", () => {
            const registeredAt: Date = new Date("2020-04-04T12:12:12.000Z");
            expect(reg.RegisteredAt).toStrictEqual(registeredAt)
        })

        test("Unit test: Social Registration - get updatedAt", () => {
            const updatedAt: Date = new Date("2020-04-04T22:12:32.000Z")
            expect(reg.UpdatedAt).toStrictEqual(updatedAt)
        })
    })

    describe("Missing Predicate in Registration", () => {
        describe("Missing Predicates registeredBy and registeredWith", () => {
            let reg: ApplicationRegistration;
    
            beforeAll(async () => {
                const id = pod + "test-unchangeable/wrong-rdfs/wrongApplicationRegistration1/";
                reg = await getResource(ApplicationRegistration, session.fetch, id);
            });
    
            test("Unit test: Application Registration - get registeredBy", () => {
                expect(() => {reg.RegisteredBy}).toThrow(SAIViolationMissingTripleError)
            })
    
            test("Unit test: Application Registration - get registeredWith", () => {
                expect(() => {reg.RegisteredWith}).toThrow(SAIViolationMissingTripleError)
            })
        })

        describe("Missing Predicates registeredAt and updatedAt", () => {
            let reg: ApplicationRegistration;
    
            beforeAll(async () => {
                const id = pod + "test-unchangeable/wrong-rdfs/wrongApplicationRegistration2/";
                reg = await getResource(ApplicationRegistration, session.fetch, id);
            });

            test("Unit test: Application Registration - get registeredAt", () => {
                expect(() => {reg.RegisteredAt}).toThrow(SAIViolationMissingTripleError)
            })
    
            test("Unit test: Application Registration - get updatedAt", () => {
                expect(() => {reg.UpdatedAt}).toThrow(SAIViolationMissingTripleError)
            })
        })
    })
})