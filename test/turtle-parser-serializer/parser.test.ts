import {getRDFFromPath} from "../Utils/get-RDF";
import {ParserResult, parseTurtle} from "../../src/data-management/turtle/turtle-parser";
import {DataFactory, Store} from "n3";
import {INTEROP} from "../../src/data-management/data-model/namespace";
import {SAIViolationError} from "../../src";

const { namedNode, quad, literal } = DataFactory;

describe('TurtleParser', () => {
    it('should be able to parse a turtle without throw any exception', async () => {
        const rdfTurtle = getRDFFromPath("../../solid-server/Alice-pod/registries-unchangeable/agents/2f2f3628ApplicationRegistration/e2765d6dAccessGrant$.ttl")
        await parseTurtle(rdfTurtle)
        expect(true).toBe(true);
    });

    it('should be able to parse', async () => {
        const store = new Store();
        const triple = (predicate: string, object: string ) => quad(namedNode("http://localhost:3000/Alice-pod/registries-unchangeable/agents/2f2f3628ApplicationRegistration/e2765d6dAccessGrant"), namedNode(predicate), namedNode(object));
        store.add(triple("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", INTEROP + "AccessGrant"));
        store.add(triple(INTEROP + "registeredBy", "http://localhost:3000/Alice-pod/profile/card#me"));
        store.add(quad(namedNode("http://localhost:3000/Alice-pod/registries-unchangeable/agents/2f2f3628ApplicationRegistration/e2765d6dAccessGrant"), namedNode(INTEROP + "grantedAt"), literal("2020-12-04T20:15:47.000Z", namedNode("xsd:dateTime"))));
        store.add(triple(INTEROP + "grantee", "http://localhost:3000/Alice-pod/profile-documents/projectron#id"));
        store.add(triple(INTEROP + "hasAccessNeedGroup", "http://localhost:3000/Alice-pod/profile-documents/projectron#need-group-pm"));
        store.add(triple(INTEROP + "hasDataGrant", "http://localhost:3000/Alice-pod/registries-unchangeable/agents/2f2f3628ApplicationRegistration/f54a1b6a0DataGrant"));
        store.add(triple(INTEROP + "hasDataGrant", "http://localhost:3000/Alice-pod/registries-unchangeable/agents/2f2f3628ApplicationRegistration/f0e4cb692DataGrant"));
        
        const prefixes = { "acl": namedNode("http://www.w3.org/ns/auth/acl#"), "interop": namedNode("http://www.w3.org/ns/solid/interop#"), "xsd": namedNode("http://www.w3.org/2001/XMLSchema#"), "rdfs": namedNode("http://www.w3.org/2000/01/rdf-schema#"), "rdf": namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#") };

        const expected = new ParserResult(store, prefixes);
        const rdfTurtle = getRDFFromPath("../../solid-server/Alice-pod/registries-unchangeable/agents/2f2f3628ApplicationRegistration/e2765d6dAccessGrant$.ttl")
        const actual = await parseTurtle(rdfTurtle)

        expect(actual).toStrictEqual(expected);
    });

    it('should not be able to parse an invalid turtle #1', async () => {
        expect(() => parseTurtle("rdfTurtle")).rejects.toThrow(SAIViolationError);
    });

    it('should not be able to parse an invalid turtle #2', async () => {
        const text = `<http://localhost:3000/Alice-pod/registries-unchangeable/agents/2f2f3628ApplicationRegistration/e2765d6dAccessGrant> a interop:AccessGrant;
        interop:grantedBy <http://localhost:3000/Alice-pod/profile/card#me>;
        interop:grantedAt "2020-12-04T20:15:47.000Z"^^xsd:dateTime;`
        expect(() => parseTurtle(text)).rejects.toThrow(SAIViolationError);
    });

});