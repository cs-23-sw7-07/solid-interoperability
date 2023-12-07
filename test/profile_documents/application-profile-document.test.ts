import { AccessNeedGroup, ApplicationProfileDocument, getResource } from "../../src";
import { getNodeTestingEnvironment, getAuthenticatedSession, getPodRoot } from "@inrupt/internal-test-env";
import { Session } from "@inrupt/solid-client-authn-node";

describe("ApplicationProfileDocument", () => {
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

    describe("Unit test - ApplicationProfileDocument - test get and methods", () => {
        let applicationProfileDocument: ApplicationProfileDocument;
        beforeAll(async () => {
            const id = pod + "profile-document/projectron#id";
            applicationProfileDocument = await getResource(ApplicationProfileDocument, session.fetch, id);
        });
    
        it("Unit test - get ApplicationName", () => {
            // Set the expected value for ApplicationName
            const expectedApplicationName = "Application1";
    
            // Call the getter method
            const actualApplicationName = applicationProfileDocument.ApplicationName;
    
            // Assert that the actual value matches the expected value
            expect(actualApplicationName).toEqual(expectedApplicationName);
        });
    
        it("Unit test - get ApplicationDescription", () => {
            // Set the expected value for ApplicationDescription
            const expectedApplicationDescription = "Example Application Description";
    
            // Call the getter method
            const actualApplicationDescription = applicationProfileDocument.ApplicationDescription;
    
            // Assert that the actual value matches the expected value
            expect(actualApplicationDescription).toEqual(expectedApplicationDescription);
        });
    
        it("Unit test - get ApplicationAuthor", () => {
            const expected = "Application Author";
            const actual = applicationProfileDocument.ApplicationAuthor;
            expect(actual).toEqual(expected);
        });
    
        it("Unit test - get ApplicationThumbnail", () => {
            const expected = "http://application.com/tunmbnail.png";
            const actual = applicationProfileDocument.ApplicationThumbnail;
            expect(actual).toEqual(expected);
        });

        it("Unit test - get getHasAccessNeedGroup", async () => {
            const expected = [await getResource(AccessNeedGroup, session.fetch, pod + "profile-document/projectron#access-need-group")];
            const actual = await applicationProfileDocument.getHasAccessNeedGroup();
            expect(actual).toEqual(expected);
        });
    
        it("Unit test - get HasAuthorizationCallbackEndpoint", () => {
            const expected = "http://localhost:3000/Alice-pod/profile-documents/projectron/auth-callback";
            const actual = applicationProfileDocument.HasAuthorizationCallbackEndpoint;
            expect(actual).toEqual(expected);
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
