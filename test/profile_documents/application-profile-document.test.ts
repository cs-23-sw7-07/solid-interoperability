import {AccessNeedGroup, ApplicationProfileDocument, getResource, SAIViolationMissingTripleError} from "../../src";
import {getAuthenticatedSession, getNodeTestingEnvironment, getPodRoot} from "@inrupt/internal-test-env";
import {Session} from "@inrupt/solid-client-authn-node";
import {INTEROP} from "../../src/data-management/data-model/namespace";

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
            const id = pod + "profile-documents/projectron#id";
            applicationProfileDocument = await getResource(ApplicationProfileDocument, session.fetch, id);
        });
    
        it("Unit test - get ApplicationName", () => {
            // Set the expected value for ApplicationName
            const expectedApplicationName = "Projectron";
    
            // Call the getter method
            const actualApplicationName = applicationProfileDocument.ApplicationName;
    
            // Assert that the actual value matches the expected value
            expect(actualApplicationName).toEqual(expectedApplicationName);
        });
    
        it("Unit test - get ApplicationDescription", () => {
            // Set the expected value for ApplicationDescription
            const expectedApplicationDescription = "Manage projects with ease";
    
            // Call the getter method
            const actualApplicationDescription = applicationProfileDocument.ApplicationDescription;
    
            // Assert that the actual value matches the expected value
            expect(actualApplicationDescription).toEqual(expectedApplicationDescription);
        });
    
        it("Unit test - get ApplicationAuthor", () => {
            const expected = "http://acme.example/#corp";
            const actual = applicationProfileDocument.ApplicationAuthor;
            expect(actual).toEqual(expected);
        });
    
        it("Unit test - get ApplicationThumbnail", () => {
            const expected = "http://localhost:3000/Alice-pod/profile-documents/projectronthumb.svg";
            const actual = applicationProfileDocument.ApplicationThumbnail;
            expect(actual).toEqual(expected);
        });

        it("Unit test - get getHasAccessNeedGroup", async () => {
            const expected = [await getResource(AccessNeedGroup, session.fetch, pod + "profile-documents/projectron#need-group-pm")];
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
            const id = "http://example-app.com/profile-documents/wrongprojectron#id";
            applicationProfileDocument = new ApplicationProfileDocument(id, session.fetch);
        });
    
        it("Unit test - get ApplicationName", () => {
            expect(() => {applicationProfileDocument.ApplicationName}).toThrow(SAIViolationMissingTripleError);
            expect(() => {applicationProfileDocument.ApplicationName}).toThrow(INTEROP + "applicationName");
        });
    
        it("Unit test - get ApplicationDescription", () => {
            expect(() => {applicationProfileDocument.ApplicationDescription}).toThrow(SAIViolationMissingTripleError);
            expect(() => {applicationProfileDocument.ApplicationDescription}).toThrow(INTEROP + "applicationDescription");
        });
    
        it("Unit test - get ApplicationAuthor", () => {
            expect(() => {applicationProfileDocument.ApplicationAuthor}).toThrow(SAIViolationMissingTripleError);
            expect(() => {applicationProfileDocument.ApplicationAuthor}).toThrow(INTEROP + "applicationAuthor");
        });
    
        it("Unit test - get ApplicationThumbnail", () => {
            const actual = applicationProfileDocument.ApplicationThumbnail;
            expect(actual).toEqual(undefined);
        });
        
        it("Unit test - get getHasAccessNeedGroup", () => {
            expect(async () => await applicationProfileDocument.getHasAccessNeedGroup()).rejects.toThrow(SAIViolationMissingTripleError);
            expect(async () => await applicationProfileDocument.getHasAccessNeedGroup()).rejects.toThrow(INTEROP + "hasAccessNeedGroup");
        });
    
        it("Unit test - get HasAuthorizationCallbackEndpoint", () => {
            const actual = applicationProfileDocument.HasAuthorizationCallbackEndpoint;
            expect(actual).toEqual(undefined);
        });
    });
});
