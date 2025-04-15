# ChronoLibrary

Contains all repositories that have to do with working with Chrono event sourcing.

## ChronoState

- [ChronoState](./packages/chronostate/README.md)
  - A small indexer that reads the cosmos bank module transfers and parses the relevant information for every transaction.

## ChronoConstructor

- [ChronoConstructor](./packages/chronoconstructor/README.md)
  - A web library for parsing actions from ChronoSync and invoking functions based on the URLParsing format.

## ChronoDocs

- [ChronoDocs](./packages/chronodocs/README.md)
  - A standalone vitepress documentation that contains documentation for all services in Chrono Library.

## ChronoSync

A live indexing service that uses ChronoState to store relevant transactions with matching prefixes, receivers, etc.

Comes in 3 different flavors; mongodb, postgres, sqlite.

- [MongoDB](./packages/chronosync-mongodb/README.md)
- [Postgres](./packages/chronosync-postgres/README.md)
- [SQLite](./packages/chronosync-sqlite/README.md)
