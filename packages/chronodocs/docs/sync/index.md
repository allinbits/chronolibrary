---
order: 99
outline: 'deep'
---

# ChronoSync

ChronoSync is a service that provides REST endpoints to query memos as they are processed from blockchain events. Built using Node.js, it leverages the power of blockchain memos and facilitates querying event histories, making it easier to track state changes over time.

## Overview
ChronoSync is designed to help you query blockchain event data using simple REST endpoints. By processing memos and building event history, it enables you to retrieve actions, events, and transactions from the blockchain.

### How ChronoSync Works

ChronoSync reads blockchain blocks and processes memos, storing event data for easy retrieval. 

It also stores the last block stored, ensuring that when ChronoSync is restarted it will pickup where it left off.

## Flavors of ChronoSync

ChronoSync has multiple iterations that allow you to easily pick your own starting point to start indexing memos from a chain using [ChronoState](../state/index.md).

- [SQLite](https://github.com/allinbits/chronolibrary/tree/main/packages/chronosync-sqlite)
- [MongoDB](https://github.com/allinbits/chronolibrary/tree/main/packages/chronosync-mongodb)
- [Postgres](https://github.com/allinbits/chronolibrary/tree/main/packages/chronosync-postgres)