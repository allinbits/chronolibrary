---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Chrono Library"
  tagline: "Reconstructable State Applications on AtomOne"
  actions:
    - theme: 'alt'
      text: 'Overview'
      link: 'https://preview.chronolibrary.com'
    - theme: 'alt'
      text: "Getting Started"
      link: /getting-started

features:
  - title: "🔗 Chrono Sync"
    details: "ChronoSync is a service that provides REST endpoints to query memos as they are processed from blockchain events."
    link: "/sync"
  - title: "🔗 Chrono State"
    details: "ChronoState is a library designed to reconstruct past states and validate present actions in applications by leveraging event sourcing."
    link: "/state"
  - title: "🔗 Chrono Constructor"
    details: "An web compatible action parsing library to bind prefix data to functions to reconstruct state on client-side."
    link: "/constructor"
---

<br />
<br />

# What is Chrono Library?

ChronoState and ChronoSync work seamlessly together, providing a robust framework for building scalable blockchain applications.

ChronoLibrary is a toolkit that empowers developers to create fully reproducible application state that can be replayed by any client and can be utilized by anyone to create front-facing applications with shared application state.

Anyone can then use that shared application state to build their own uncensorable applications, or provide custom features based on protocols written by the community.

## Dynamic State Reconstruction

* **Event Sourcing at Core:** ChronoState, a key component of the library, uses event sourcing to reconstruct application states by replaying a series of events recorded in blockchain memos.

* **Flexible Memo Parsing:** It parses memos embedded within transactions, allowing developers to specify prefixes that trigger specific actions. This ensures that only relevant events are processed and handled.

* **Scalable Architecture:** Designed to handle the inflow of blockchain data, ChronoState can be easily integrated with most cosmos chains. With its main focus on AtomOne.

## Real-Time Memo Parsing

* **Memo-Driven Actions:** Memos act as containers for event-specific information, detailing the action to be performed and the address responsible. This makes it easy to validate and execute actions in real-time.

* **Action State Handling:** ChronoState outputs an event when a matching event memo prefix is found. Meaning your application can live under a specific address with a specific memo prefix.

* **Event History Tracking:** With ChronoSync, developers can take the individual events and decide whether to store them, forward them, or do nothing with them.

## Easy Setup and Integration

* **Flexible Configuration:** Whether you’re building a custom application or leveraging pre-built tools, ChronoState provides easy-to-use configurations. Developers can specify API URLs, memo prefixes, start blocks, and more.

* **Multiple Database Options:** ChronoSync comes in various flavors, supporting SQLite, MongoDB, and Postgres databases. This flexibility ensures that developers can choose the storage solution best suited to their needs.

* **Optional Parameters:** Developers have the flexibility to use optional parameters like receiver and sender addresses to filter events based on specific criteria.