"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var n3_1 = require("n3");
var DataFactory = n3_1.default.DataFactory;
var namedNode = DataFactory.namedNode, literal = DataFactory.literal, defaultGraph = DataFactory.defaultGraph, quad = DataFactory.quad, variable = DataFactory.variable, blankNode = DataFactory.blankNode;
var writer = new n3_1.default.Writer({ prefixes: { c: 'http://example.org/cartoons#',
        foaf: 'http://xmlns.com/foaf/0.1/' } }, { format: "Turtle" });
writer.addQuad(writer.blank(namedNode('http://xmlns.com/foaf/0.1/givenName'), literal('Tom', 'en')), namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), namedNode('http://example.org/cartoons#Cat'));
writer.addQuad(quad(namedNode('http://example.org/cartoons#Jerry'), namedNode('http://xmlns.com/foaf/0.1/knows'), writer.blank([{
        predicate: namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
        object: namedNode('http://example.org/cartoons#Cat'),
    }, {
        predicate: namedNode('http://xmlns.com/foaf/0.1/givenName'),
        object: literal('Tom', 'en'),
    }])));
writer.addQuad(namedNode('http://example.org/cartoons#Mammy'), namedNode('http://example.org/cartoons#hasPets'), writer.list([
    namedNode('http://example.org/cartoons#Tom'),
    namedNode('http://example.org/cartoons#Jerry'),
]));
writer.end(function (error, result) { return console.log(result); });
