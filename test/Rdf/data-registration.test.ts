import {getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot} from "@inrupt/internal-test-env";
import {Session} from "@inrupt/solid-client-authn-node";
import {ApplicationAgent, DataRegistration, getResource, SocialAgent} from "../../src";


describe("Testing pod communication for Data Registration", () => {
    let session: Session;
    let pod: string

    beforeAll(async () => {
        const env = getNodeTestingEnvironment()
        session = await getAuthenticatedSession(env)
        pod = await getPodRoot(session);
    });

    test("Data Registration - Able to store an Data Registration", async () => {
        const id: string = pod + "test-created/dataRegistration1/";
        const registeredBy = new SocialAgent(pod + "profile/card#me");
        const registeredWith = new ApplicationAgent(pod + "profile-documents/authorization-agent#id");
        const registeredAt = new Date();
        const updatedAt = new Date();
        const registeredShapeTree: string = pod + "registries-unchangeable/shapeTrees/8501f084ShapeTree/";
        
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