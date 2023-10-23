import { ExportToRDF } from "./src/data-management/rdf-handler/to-rdf";
import { socialAgentRegistrationc4562da9 } from "./test/test-case";

new ExportToRDF().toRdfSocialAgentRegistration(socialAgentRegistrationc4562da9).then(a => console.log(a))