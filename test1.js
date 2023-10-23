"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var to_rdf_1 = require("./src/data-management/rdf-handler/to-rdf");
var test_case_1 = require("./test/test-case");
new to_rdf_1.ExportToRDF().toRdfSocialAgentRegistration(test_case_1.socialAgentRegistrationc4562da9).then(function (a) { return console.log(a); });
