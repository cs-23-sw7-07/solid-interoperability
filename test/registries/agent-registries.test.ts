import {getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot} from "@inrupt/internal-test-env";
import {Session} from "@inrupt/solid-client-authn-node";
import {AgentRegistryResource, ApplicationRegistration, getResource, SocialAgentRegistration} from "../../src";
import {randomUUID} from "crypto";
import {copyFolder, deleteFolder} from "../Utils/folder-management";

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
            const expected: ApplicationRegistration[] = [await getResource(ApplicationRegistration, session.fetch, pod + "registries-unchangeable/agents/2f2f3628ApplicationRegistration/")];
            expect(await agentRegistry.getHasApplicationRegistration()).toStrictEqual(expected);
        })
    })


    describe("Replaces no authorization", () => {
        const container = "registries-unchangeable"
        const root = "./solid-server/Alice-pod/";
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
            const applicationReg = await getResource(ApplicationRegistration, session.fetch, pod + "registries-unchangeable/agents/2f2f3628ApplicationRegistration/")
            await agentReg.addRegistration(applicationReg);

            const regs = await agentReg.getHasApplicationRegistration();

            expect(regs).toContainEqual(applicationReg);
        })

        test("Unit test: AgentRegistryResource - addRegistration #2", async () => {
            const socialReg = await getResource(SocialAgentRegistration, session.fetch, pod + "registries-unchangeable/agents/c4562da9SocialAgentRegistration/");
            await agentReg.addRegistration(socialReg);

            const regs = await agentReg.getHasSocialAgentRegistration();

            expect(regs).toContainEqual(socialReg);
        })
    })
})