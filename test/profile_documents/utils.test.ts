import { DataFactory, Quad, Store } from "n3";
import { ProfileDocument } from "../../src/data-management/data-model/profile-documents/profile-document";
import { isApplicationAgent } from "../../src/data-management/data-model/profile-documents/utils";
import { INTEROP, TYPE_A } from "../../src/data-management/data-model/namespace";

const { namedNode } = DataFactory;

describe('isApplicationAgent', () => {
    it('should return true if the agent type includes "Application"', () => {
        const quad = new Quad(namedNode("https://example.com/profiles#me"), namedNode(TYPE_A), namedNode(INTEROP + "Application"));
        const mockProfile: ProfileDocument = new ProfileDocument("https://example.com/profiles#me", fetch, new Store([quad]), {});

        expect(isApplicationAgent(mockProfile)).toBe(true);
    });

    it('should return false if the agent type does not include "Application"', () => {
        const quad = new Quad(namedNode("https://example.com/profiles#me"), namedNode(TYPE_A), namedNode(INTEROP + "SocialAgent"));
        const mockProfile: ProfileDocument = new ProfileDocument("https://example.com/profiles#me", fetch, new Store([quad]), {});

        expect(isApplicationAgent(mockProfile)).toBe(false);
    });

    it('should throw an error if the agent type is not defined', () => {
        const mockProfile: ProfileDocument = new ProfileDocument("https://example.com/profiles#me", fetch, new Store(), {});

        expect(() => isApplicationAgent(mockProfile)).toThrow('The subject in the profile document has no agent type');
    });
});