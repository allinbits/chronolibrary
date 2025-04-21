---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Chrono Library"
  tagline: "Reconstructable State Applications on AtomOne"
  actions:
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

