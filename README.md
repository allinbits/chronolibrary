# TemporaLib

Contains all repositories that have to do with working with Tempora event sourcing.

- [TemporaState](./packages/temporastate/README.md)
  - A small indexer that reads the cosmos bank module transfers and parses the relevant information for every transaction. 
- [TemporaSync](./packages/temporasync/README.md)
  - A live indexing service that uses TemporaState to store relevant transactions with matching prefixes, receivers, etc.
  - This is a deployable REST service that users can interact with to get actions for a given memo prefix.
- [TemporaConstructor](./packages/temporaconstructor/README.md)
  - A web library for parsing actions from TemporaSync and invoking functions based on the URLParsing format.
- [TemporaDocs](./packages/temporadocs/README.md)
  - A standalone vitepress documentation that contains documentation for all services in TemporaLib.