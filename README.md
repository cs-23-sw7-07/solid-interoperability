# solid-interoperability
[![codecov](https://codecov.io/gh/cs-23-sw7-07/solid-interoperability/graph/badge.svg?token=N9ZdihkM4n)](https://codecov.io/gh/cs-23-sw7-07/solid-interoperability) 
[![Node.js CI](https://github.com/cs-23-sw7-07/solid-interoperability/actions/workflows/node.js.yml/badge.svg)](https://github.com/cs-23-sw7-07/solid-interoperability/actions/workflows/node.js.yml)

## This library contains the following functionality:
- [x] Create RDFs for the [Solid Interoperability Specification](https://solid.github.io/data-interoperability-panel/specification/)
- [x] Can read and parse RDFs into objects such as `Social Agent Registration`
- [x] And more...
- [ ] Thing we won't have

## Quick user guide
Here a quick guide using some of the core features will be showcased.
### Creating RDFs
Creating an instance of the `RdfFactory` you will be able to call `.toRdf()` taking any type which implements `ItoRdf`. These types can be found in `src/data-management/data-model`. This way one can quickly turn the data models into RDFs to post to their desired PODs.
