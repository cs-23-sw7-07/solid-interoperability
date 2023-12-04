import {getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot} from "@inrupt/internal-test-env";
import {Session} from "@inrupt/solid-client-authn-node";
import {
    AccessGrant,
    AccessNeedGroup,
    ApplicationAgent,
    ApplicationRegistration,
    DataAuthorization,
    DataGrant,
    getResource,
    getResources,
    SAIViolationMissingTripleError,
    SocialAgent
} from "../../src";

describe("AccessGrant - test get and set methods/properties", () => {
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

    describe("AccessGrant", () => {
        let access: AccessGrant;

        beforeAll(async () => {
            const id = pod + "registries/agents/2f2f3628ApplicationRegistration/e2765d6dAccessGrant";
            access = await getResource(AccessGrant, session.fetch, id);
        });

        test("Unit test: AccessGrant - getHasDataGrant", async () => {
            const uris = [pod + "registries/agents/2f2f3628ApplicationRegistration/f54a1b6a0DataGrant", pod + "registries/agents/2f2f3628ApplicationRegistration/f0e4cb692DataGrant"];
            const dataGrants: DataGrant[] = await getResources(DataGrant, session.fetch, uris);
            expect(await access.getHasDataGrant()).toStrictEqual(dataGrants)
        })
    })

    describe("Missing Predicates hasDataGrant", () => {
        let access: AccessGrant;

        beforeAll(async () => {
            const id = pod + "test-unchangeable/wrong-rdfs/wrongAccessGrant";
            access = await getResource(AccessGrant, session.fetch, id);
        });

        test("Unit test: AccessGrant - hasDataGrant", () => {
            expect(async () => {await access.getHasDataGrant()}).rejects.toThrow(SAIViolationMissingTripleError)
        })
    })
})

describe("Testing pod communication for Access Grant", () => {
    let session: Session;
    let pod: string

    beforeAll(async () => {
        const env = getNodeTestingEnvironment()
        session = await getAuthenticatedSession(env)
        pod = await getPodRoot(session);
    });
    
    test("Able to add an Access Grant", async () => {
        const dataGrant = await getResource(DataGrant, session.fetch, pod + "LOCATIONDataGrant")
        const id: string = pod + "applicationRegistration1/";
        const grantedBy: SocialAgent = new SocialAgent("http://localhost:3000/Alice-pod/profile/card#me");
        const grantedAt: Date = new Date();
        const grantee: ApplicationAgent = new ApplicationAgent("http://localhost:3000/MyApp/profile/card#me");
        const hasAccessNeedGroup: AccessNeedGroup = await getResource(AccessNeedGroup, session.fetch, pod + "LOCATIONAccessNeedGroup");
        const hasDataGrant: DataGrant[] = [dataGrant];

        await AccessGrant.new(id, session.fetch, grantedBy, grantedAt, grantee, hasAccessNeedGroup, hasDataGrant);
        
        const addedGrant = await getResource(AccessGrant, session.fetch, id)
        expect(addedGrant.uri).toStrictEqual(id)
        expect(addedGrant.GrantedBy).toStrictEqual(grantedBy)
        expect(addedGrant.GrantedAt).toStrictEqual(grantedAt)
        expect(addedGrant.Grantee).toStrictEqual(grantee)
        expect(addedGrant.getHasDataGrant).toStrictEqual(hasDataGrant)
    })
})