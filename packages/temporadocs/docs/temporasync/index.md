---
order: 99
outline: 'deep'
---

# TemporaSync

TemporaSync is a service that provides REST endpoints to query memos as they are processed from blockchain events. Built using Node.js, SQLite, and Elysia, it leverages the power of blockchain memos and facilitates querying event histories, making it easier to track state changes over time. This page will guide you on how to set up TemporaSync for your own use and point you to resources for deeper integration.

## Overview
TemporaSync is designed to help you query blockchain event data using simple REST endpoints. By processing memos and building event history, it enables you to retrieve actions, events, and transactions from the blockchain.

### Key Features:
- RESTful API: Access event data through easy-to-use endpoints.

- Data Persistence: Events and actions are stored in an SQLite database for efficient querying.

- Dockerized Setup: Quickly spin up and tear down the service using Docker for local development and testing.

### How TemporaSync Works

TemporaSync listens to blockchain data and processes memos, storing event data for easy retrieval. Once set up, you can interact with it via HTTP requests to query different types of data. This is especially useful for applications that need to monitor blockchain events or reconstruct state based on past actions.

### Core Components:

- SQLite: A local database to store parsed event data for querying.

- Docker: Ensures easy deployment and teardown of the TemporaSync service.

- Elysia: The framework used to power TemporaSync’s REST API.