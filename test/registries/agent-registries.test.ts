import {getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot} from "@inrupt/internal-test-env";
import {Session} from "@inrupt/solid-client-authn-node";
import {
    AccessAuthorization, AccessGrant,
    AgentRegistryResource,
    ApplicationAgent,
    ApplicationRegistration,
    DataAuthorization, DataGrant, DataRegistration,
    getResource,
    getResources,
    IDataGrantBuilder,
    SAIViolationMissingTripleError, SocialAgent, SocialAgentRegistration
} from "../../src";
import { randomUUID } from "crypto";
import { copyFolder, deleteFolder, replaceFolder } from "../setup/folder-management";

describe("Agent registry set - test properties/methods", () => {
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

    describe("AgentRegistryResource", () => {
        let agentRegistry: AgentRegistryResource;

        beforeAll(async () => {
            const id = pod + "registries-unchangeable/agents/";
            agentRegistry = await getResource(AgentRegistryResource, session.fetch, id);
        });

        test("Unit test: AgentRegistryResource - getHasSocialAgentRegistration", async () => {
            const expected: SocialAgentRegistration[] = [await getResource(SocialAgentRegistration, session.fetch, pod + "registries-unchangeable/agents/c4562da9SocialAgentRegistration/")]; 
            expect(await agentRegistry.getHasSocialAgentRegistration()).toStrictEqual(expected);
        })

        test("Unit test: AgentRegistryResource - getHasApplicationRegistration", async () => {
            const expected: ApplicationRegistration[] = [await getResource(ApplicationRegistration, session.fetch, pod + "registries-unchangeable/agents/2f2f3628ApplicationRegistration")];
            expect(await agentRegistry.getHasApplicationRegistration()).toStrictEqual(expected);
        })
    })


    describe("Replaces no authorization", () => {
        const container = "registries-unchangeable"
        const root = "../../solid-server/Alice-pod/";
        const containerNewName = container + randomUUID()
        let agentReg: AgentRegistryResource;

        beforeAll(async () => {
            await copyFolder(root + container, root + containerNewName)
            const id = pod + containerNewName + "/agents/";
            agentReg = await getResource(AgentRegistryResource, session.fetch, id);
        });

        afterAll(async () => {
            await deleteFolder(root + containerNewName)
        });

        test("Unit test: AgentRegistryResource - addRegistration #1", async () => {
            const applicationReg = new ApplicationRegistration(pod + "registries-unchangeable/agents/2f2f3628ApplicationRegistration/", session.fetch);
            await agentReg.addRegistration(applicationReg);

            const regs = await agentReg.getHasApplicationRegistration();

            expect(regs).toContain([applicationReg]);
        })

        test("Unit test: AgentRegistryResource - addRegistration #2", async () => {
            const socialReg = new SocialAgentRegistration(pod + "registries-unchangeable/agents/2f2f3628SocialRegistration/", session.fetch);
            await agentReg.addRegistration(socialReg);

            const regs = await agentReg.getHasSocialAgentRegistration();

            expect(regs).toContain([socialReg]);
        })
    })

    describe("No Registration", () => {
        let agentReg: AgentRegistryResource;

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

    describe("Convert from authorization to grant", () => {

        class MockBuilder implements IDataGrantBuilder {
            generateId(): string {
                return pod + "registries-unchangeable/agents/2f2f3628ApplicationRegistration/f54a1b6a0DataGrant";
            }

            getAllDataRegistrations(_registeredShapeTree: string, _dataOwner?: SocialAgent): Promise<DataRegistration[]> {
                return Promise.reject([]);
            }

            getInheritedDataGrants(_auth: DataAuthorization): Promise<DataGrant[]> {
                return Promise.reject([]);
            }

        }

        test("Unit test: Access authorization to Access grant", async () => {
            const expected = await getResource(AccessGrant, session.fetch, pod + "registries-unchangeable/agents/2f2f3628ApplicationRegistration/e2765d6dAccessGrant");

            const uris = [pod + "registries-unchangeable/agents/2f2f3628ApplicationRegistration/f54a1b6a0DataGrant", pod + "registries-unchangeable/agents/2f2f3628ApplicationRegistration/f0e4cb692DataGrant"];
            const dataGrants: DataGrant[] = await getResources(DataGrant, session.fetch, uris);

            const auth = await getResource(AccessAuthorization, session.fetch, pod + "registries-unchangeable/authorization/e2765d6cAccessAuthReplace");

            const actual = await auth.toAccessGrant(pod + "registries-unchangeable/agents/2f2f3628ApplicationRegistration/e2765d6dAccessGrant100", dataGrants);
            expect(actual.GrantedBy).toStrictEqual(expected.GrantedBy);
            expect(actual.GrantedAt).toStrictEqual(expected.GrantedAt);
            expect(await actual.getGrantee()).toStrictEqual(await expected.getGrantee());
            expect(actual.getHasAccessNeedGroup()).toStrictEqual(expected.getHasAccessNeedGroup());
            expect(actual.getHasDataGrant()).toStrictEqual(expected.getHasDataGrant());
        })
    })
})