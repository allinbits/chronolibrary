<p align="center">
  <img src="./packages/chronodocs/docs/public/logo-full.svg" />
</p>

# ChronoLibrary

Contains all repositories that have to do with working with Chrono event sourcing.

- [Learn](https://preview.chronolibrary.com)
- [Documentation](https://chronolibrary.com)

## ChronoState

- [ChronoState](./packages/chronostate)
  - A small indexer that reads the cosmos bank module transfers and parses the relevant information for every transaction.

## ChronoConstructor

- [ChronoConstructor](./packages/chronoconstructor)
  - A web library for parsing actions from ChronoSync and invoking functions based on the URLParsing format.

## ChronoDocs

- [ChronoDocs](./packages/chronodocs)
  - A standalone vitepress documentation that contains documentation for all services in Chrono Library.

## ChronoSync

A live indexing service that uses ChronoState to store relevant transactions with matching prefixes, receivers, etc.

Comes in 3 different flavors; mongodb, postgres, sqlite.

- [MongoDB](./packages/chronosync-mongodb)
- [Postgres](./packages/chronosync-postgres)
- [SQLite](./packages/chronosync-sqlite)

## Examples

Currently there's one example in this repository for a tic tac toe game.

- [Tic Tac Photon Example](./packages/example-tic-tac-photon)
