---
order: 99
outline: 'deep'
---

# Getting Started

This library consists of 3 different pieces to make the whole vision come alive.

- [Sync](../sync/index.md) - Is a dockerized application that reads memos from any cosmos based blockchain and provides a REST endpoint to easily query memos under a given namespace.

- [State](../state/index.md) - Is the driver behind the dockerized application, it's a mini indexer that specifically gathers memos from the cosmos banking module.

- [Constructor](../constructor/index.md) - Is a client focused library that allows you to easily bind an action to a function to help reconstruct state.

## Where to Start?

It's almost always recommended to get started with [Sync](../sync/index.md) and try spinning up the container. This will allow you to begin building an application and listening for memos relevant to your individual application.