# solid-interoperability
[![codecov](https://codecov.io/gh/cs-23-sw7-07/solid-interoperability/graph/badge.svg?token=N9ZdihkM4n)](https://codecov.io/gh/cs-23-sw7-07/solid-interoperability) 
[![Node.js CI](https://github.com/cs-23-sw7-07/solid-interoperability/actions/workflows/node.js.yml/badge.svg)](https://github.com/cs-23-sw7-07/solid-interoperability/actions/workflows/node.js.yml)

## This library contains the following functionality:
- [x] Create RDFs for the [Solid Interoperability Specification](https://solid.github.io/data-interoperability-panel/specification/)
- [x] Can read and parse RDFs into objects such as `Access Authorization`
- [x] Save RDFs to your desired POD
- [x] Create Registries for your POD
- [x] Registrer both access and data authorizations
- [x] Create access and data grants 
- [x] And more...
- [ ] Shape Trees, for now, are **not** implemented but are important for the specification.
## Quick user guide
Here is a quick guide, using some of the core features of this library, showcasing some use cases.
### Creating RDFs
Creating an instance of the `RdfFactory` you will be able to call the `.create()` method, parameterized with any type that implements `ItoRdf`. These types can be found in `src/data-management/data-model`. This way one can quickly turn the data models into RDFs, which then can be posted to their desired PODs.
### Reading RDFs
Using an instance of the `RdfFactory` one can call the `.parse()` method with an RDF, representing either one of the classes defined in the `src/data-management/data-model`, as a string. The method may return a `Map<>` of all parameters used to instantiate the object that the RDF represents. You can use the `.get('type')` on the return value if you are in doubt about which type the RDF should be converted to.
