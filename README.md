# ChronoLibrary

Contains all repositories that have to do with working with Chrono event sourcing.

- [ChronoState](./packages/chronostate/README.md)
  - A small indexer that reads the cosmos bank module transfers and parses the relevant information for every transaction. 
- [ChrnoSync](./packages/chronoSync/README.md)
  - A live indexing service that uses ChronoState to store relevant transactions with matching prefixes, receivers, etc.
  - This is a deployable REST service that users can interact with to get actions for a given memo prefix.
- [ChronoConstructor](./packages/chronoconstructor/README.md)
  - A web library for parsing actions from ChronoSync and invoking functions based on the URLParsing format.
- [ChronoDocs](./packages/chronodocs/README.md)
  - A standalone vitepress documentation that contains documentation for all services in Chrono Library.