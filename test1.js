const N3 = require('n3');
const { DataFactory } = N3;
const { namedNode, literal, defaultGraph, quad } = DataFactory;

const writer = new N3.Writer({ prefixes: { c: 'http://example.org/cartoons#' } }); // Create a writer which uses `c` as a prefix for the namespace `http://example.org/cartoons#`
writer.addQuad(
  namedNode('http://example.org/cartoons#Tom'),                 // Subject
  namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'), // Predicate
  namedNode('http://example.org/cartoons#Cat')                  // Object
);
writer.addQuad(quad(
  namedNode('http://example.org/cartoons#Tom'),   // Subject
  namedNode('http://example.org/cartoons#name'),  // Predicate
  literal('Tom')                                  // Object
));
writer.end((error, result) => console.log(result));