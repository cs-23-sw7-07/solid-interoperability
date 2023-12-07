import {
    ApplicationProfileDocument,
    getResource,
    RegistrySetResource,
    SAIViolationError,
    SocialAgentProfileDocument
} from "../../src";
import {getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot} from "@inrupt/internal-test-env";
import {Session} from "@inrupt/solid-client-authn-node";

describe("SocialAgentProfileDocument", () => {
    let session: Session;
    let pod: string;

    beforeAll(async () => {
        const env = getNodeTestingEnvironment();
        session = await getAuthenticatedSession(env)
        pod = await getPodRoot(session);
    });

    afterAll(async () => {
        await session.logout();
    });

    describe("Unit test - ApplicationProfileDocument - test get and methods", () => {
        let socialAgentProfileDocument: SocialAgentProfileDocument;
        beforeAll(async () => {
            const id = pod + "profile/card#me";
            socialAgentProfileDocument = await getResource(SocialAgentProfileDocument, session.fetch, id);
        });
    
        it("Unit test - hasAuthorizationAgent returns true", () => {
            const expected = true;
            const authorizationUri = "http://localhost:3001/agents/aHR0cDovL2xvY2FsaG9zdDozMDAwL0FsaWNlLXBvZC9wcm9maWxlL2NhcmQjbWU=";
            const actual = socialAgentProfileDocument.hasAuthorizationAgent(authorizationUri);
    
            expect(actual).toEqual(expected);
        });

        it("Unit test - hasAuthorizationAgent returns false becuase it expects another authorizationUri", () => {
            const expected = false;
            const authorizationUri = "http://localhost:3001/agents/aHR0";
            const actual = socialAgentProfileDocument.hasAuthorizationAgent(authorizationUri);
    
            expect(actual).toEqual(expected);
        });
    
        it("Unit test - get HasRegistrySet returns true", () => {
            const expected = true;
            const actual = socialAgentProfileDocument.HasRegistrySet;
            expect(actual).toEqual(expected);
        });
    
        it("Unit test - getRegistrySet", async () => {
            const registriesContainer = pod + "registries-unchangeable/";
            const expected = await getResource(RegistrySetResource, session.fetch, registriesContainer);
            const actual = await socialAgentProfileDocument.getRegistrySet();
            expect(actual).toEqual(expected);
        });
    });

    describe("Unit test - ApplicationProfileDocument - addHasAuthorizationAgent", () => {
        it("Unit test - addHasAuthorizationAgent", async () => {
            const id = pod + "profile-example/example#id";

            const socialAgentProfileDocument: SocialAgentProfileDocument = await getResource(SocialAgentProfileDocument, session.fetch, id);

            const authorizationUri = "http://localhost:3001/agents/aHR0cDov";
            
            await socialAgentProfileDocument.addHasAuthorizationAgent(authorizationUri);

            const local_version = socialAgentProfileDocument.hasAuthorizationAgent(authorizationUri);
            expect(local_version).toEqual(true);

            const remote_version = await getResource(SocialAgentProfileDocument, session.fetch, id);
            expect(remote_version.hasAuthorizationAgent(authorizationUri)).toEqual(true);
        });
    });

    describe("Unit test - ApplicationProfileDocument - addHasRegistrySet", () => {
        it("Unit test - addHasRegistrySet", async () => {
            const id = pod + "registries-example";
            const webId = pod + "profile-example/example#id";

            const registries = await getResource(RegistrySetResource, session.fetch, id);

            const socialAgentProfileDocument: SocialAgentProfileDocument = await getResource(SocialAgentProfileDocument, session.fetch, webId);
            
            await socialAgentProfileDocument.addHasRegistrySet(registries);

            const local_version = await socialAgentProfileDocument.getRegistrySet();
            expect(local_version).toEqual(registries);
            
            const remote_version = await getResource(SocialAgentProfileDocument, session.fetch, id);
            expect(await remote_version.getRegistrySet()).toEqual(registries);
        });

        it("Unit test - addHasRegistrySet - should throw a SAIViolationError since it already has a registry set", async () => {
            const id = pod + "registries-example";
            const webId = pod + "profile/card#id";

            const registries = await getResource(RegistrySetResource, session.fetch, id);
            const socialAgentProfileDocument: SocialAgentProfileDocument = await getResource(SocialAgentProfileDocument, session.fetch, webId);
            
            expect(() => socialAgentProfileDocument.addHasRegistrySet(registries)).rejects.toThrow(SAIViolationError);
        });
    });


    describe("Unit test - ApplicationProfileDocument - test getters and methods returns undefined", () => {
        let applicationProfileDocument: ApplicationProfileDocument;
        beforeAll(async () => {
            const id = "http://example-app.com/profile-document/projectron#id";
            applicationProfileDocument = new ApplicationProfileDocument(id, session.fetch);
        });
    
        it("Unit test - get ApplicationName", () => {
            const actualApplicationName = applicationProfileDocument.ApplicationName;

            expect(actualApplicationName).toEqual(undefined);
        });
    
        it("Unit test - get ApplicationDescription", () => {
            const actualApplicationDescription = applicationProfileDocument.ApplicationDescription;
    
            expect(actualApplicationDescription).toEqual(undefined);
        });
    
        it("Unit test - get ApplicationAuthor", () => {
            const actual = applicationProfileDocument.ApplicationAuthor;
            expect(actual).toEqual(undefined);
        });
    
        it("Unit test - get ApplicationThumbnail", () => {
            const actual = applicationProfileDocument.ApplicationThumbnail;
            expect(actual).toEqual(undefined);
        });
        
        it("Unit test - get getHasAccessNeedGroup", async () => {
            const expected = [];
            const actual = await applicationProfileDocument.getHasAccessNeedGroup();
            expect(actual).toEqual(expected);
        });
    
        it("Unit test - get HasAuthorizationCallbackEndpoint", () => {
            const actual = applicationProfileDocument.HasAuthorizationCallbackEndpoint;
            expect(actual).toEqual(undefined);
        });
    });
});
