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
            const id = pod + "registries-unchangeable/agents/2f2f3628ApplicationRegistration/e2765d6dAccessGrant";
            access = await getResource(AccessGrant, session.fetch, id);
        });

        test("Unit test: AccessGrant - getHasDataGrant", async () => {
            const uris = [pod + "registries-unchangeable/agents/2f2f3628ApplicationRegistration/f54a1b6a0DataGrant", pod + "registries-unchangeable/agents/2f2f3628ApplicationRegistration/f0e4cb692DataGrant"];
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
        const dataGrant = await getResource(DataGrant, session.fetch, pod + "registries-unchangeable/agents/2f2f3628ApplicationRegistration/f54a1b6a0DataGrant")
        const id: string = pod + "test-created/accessGrant1";
        const grantedBy: SocialAgent = new SocialAgent("http://localhost:3000/Alice-pod/profile/card#me");
        const grantedAt: Date = new Date();
        const grantee: ApplicationAgent = new ApplicationAgent(pod + "profile-documents/projectron#id");
        const hasAccessNeedGroup: AccessNeedGroup = await getResource(AccessNeedGroup, session.fetch, pod + "profile-documents/projectron#need-group-pm");
        const hasDataGrant: DataGrant[] = [dataGrant];

        await AccessGrant.new(id, session.fetch, grantedBy, grantedAt, grantee, hasAccessNeedGroup, hasDataGrant);
        
        const addedGrant = await getResource(AccessGrant, session.fetch, id)
        expect(addedGrant.uri).toStrictEqual(id)
        expect(addedGrant.GrantedBy).toStrictEqual(grantedBy)
        expect(addedGrant.GrantedAt).toStrictEqual(grantedAt)
        expect(await addedGrant.getGrantee()).toStrictEqual(grantee)
        expect(await addedGrant.getHasDataGrant()).toStrictEqual(hasDataGrant)
    })
})