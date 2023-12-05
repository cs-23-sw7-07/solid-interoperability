import {getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot} from "@inrupt/internal-test-env";
import {Session} from "@inrupt/solid-client-authn-node";
import {DataGrant, getResource, SocialAgent, GrantScope, DataRegistration, AccessNeed, AccessMode, Agent, DataAuthorization, ApplicationAgent} from "../../src";


describe("Testing pod communication for Data Authorization", () => {
    let session: Session;
    let pod: string

    beforeAll(async () => {
        const env = getNodeTestingEnvironment()
        session = await getAuthenticatedSession(env)
        pod = await getPodRoot(session);
    });
    DataGrant
    test("Data Registration - scopeOfGrant All/AllFromAgent/AllFromReg/SelectedFromReg/Inherited", async () => {
        const id: string = pod + "test-created/dataGrant1/";
        const registeredBy = new SocialAgent(pod + "profile/card#me");
        const registeredWith = new ApplicationAgent(pod + "profile-documents/authorization-agent#id");
        const registeredAt = new Date();
        const updatedAt = new Date();
        const registeredShapeTree: string = pod + "registries/shapeTrees/8501f084ShapeTree/";
        
        await DataRegistration.new(id, session.fetch, registeredBy, registeredWith, registeredAt, updatedAt, registeredShapeTree);
        
        const addedRegistration = await getResource(DataRegistration, session.fetch, id)
        expect(addedRegistration.uri).toStrictEqual(id)
        expect(addedRegistration.RegisteredBy).toStrictEqual(registeredBy)
        expect(addedRegistration.RegisteredWith).toStrictEqual(registeredWith)
        expect(addedRegistration.RegisteredAt).toStrictEqual(registeredAt)
        expect(addedRegistration.UpdatedAt).toStrictEqual(updatedAt)
        expect(addedRegistration.RegisteredShapeTree).toStrictEqual(registeredShapeTree)
    })
})