---
theme: seriph
title: Chrono Library
info: Replicable application state for the clientside, everywhere. Built for AtomOne.
class: text-center
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
mdc: true
---

# ChronoLibrary

Replicable application state for the clientside, everywhere.

  Use `Arrows` or `Spacebar` to Navigate

<div class="abs-br m-6 text-xl">
  <a href="https://chronolibrary.com" target="_blank" class="slidev-icon-btn" title="Back to ChronoLibrary">
    <carbon:exit />
  </a>
  <a href="https://github.com/allinbits/chronolibrary" target="_blank" class="slidev-icon-btn" title="GitHub">
    <carbon:logo-github />
  </a>
</div>


---
transition: slide-left
---

# Problem

Corporations often hide the true state of their applications, showing only what they want you to see. Money has fully corrupted our gathering spaces on the internet.

This lack of transparency harms trust and innovation. 

Chrono Library ensures full transparency by making application state fully reproducible and easily verifiable for all users, whether they are on blockchain or traditional platforms.

<div class="abs-br m-6 text-xl">
  <a href="https://chronolibrary.com" target="_blank" class="slidev-icon-btn" title="Back to ChronoLibrary">
    <carbon:exit />
  </a>
  <a href="https://github.com/allinbits/chronolibrary" target="_blank" class="slidev-icon-btn" title="GitHub">
    <carbon:logo-github />
  </a>
</div>

---
transition: slide-left
---

# What is ChronoLibrary?

## Key Points

- **Fully Reproducible State:** Create consistent application state that can be reliably replayed by any client.
- **Seamless Integration:** ChronoState and ChronoSync work together to parse blockchain memos, ensuring real-time responsiveness and data consistency.
- **Community-Driven Customization:** Use shared state to build uncensorable applications or add custom features based on community needs / support.

## Components

- ChronoState: Parses blockchain memos based on parameters like what a namespace starts with.
- ChronoSync: Manages event storage and forwarding based on user needs.
- ChronoConstructor (Optional): Helps users reconstruct state from memo instructions.

<div class="abs-br m-6 text-xl">
  <a href="https://chronolibrary.com" target="_blank" class="slidev-icon-btn" title="Back to ChronoLibrary">
    <carbon:exit />
  </a>
  <a href="https://github.com/allinbits/chronolibrary" target="_blank" class="slidev-icon-btn" title="GitHub">
    <carbon:logo-github />
  </a>
</div>

---
transition: slide-left
---

# How?

Every blockchain including AtomOne has a `memo` field.

The `memo` field is attached to every transaction and can exist on 99% of blockchains.

We specify actions / functions in a very simple and digestable format.

## Action Formatting

In the `memo` field we would post something like this to the chain.

```ts
todo-app.add("Take the garbage out")
```

<div class="abs-br m-6 text-xl">
  <a href="https://chronolibrary.com" target="_blank" class="slidev-icon-btn" title="Back to ChronoLibrary">
    <carbon:exit />
  </a>
  <a href="https://github.com/allinbits/chronolibrary" target="_blank" class="slidev-icon-btn" title="GitHub">
    <carbon:logo-github />
  </a>
</div>

---
transition: slide-left
---


# Ask Questions

Once a user has posted their transaction to the chain, ChronoState can step in and ask some questions about the transaction.

## Transactions Contain Filtering Data

All transactions include an address of who sent it, and who is receiving it. Especially from the context of the Bank Module in the cosmos ecosystem.

- Who sent the transaction?
- Who received the transaction?
- Does the memo start with `todo-app`
- Does the transaction meet the required minimum quantity for application parsing?

All of these questions are optional, but help us filter down the ones our application cares about.

<div class="abs-br m-6 text-xl">
  <a href="https://chronolibrary.com" target="_blank" class="slidev-icon-btn" title="Back to ChronoLibrary">
    <carbon:exit />
  </a>
  <a href="https://github.com/allinbits/chronolibrary" target="_blank" class="slidev-icon-btn" title="GitHub">
    <carbon:logo-github />
  </a>
</div>

---
transition: slide-left
---

# Parse the Data

Once ChronoState has parsed the transaction, it sends it through a function to be further processed.

```ts
import { extractMemoContent } from '@atomone/chronoconstructor';

const state = new ChronoState({ ...config });
state.onAction((action) => {
  if (action.memo.startsWith('todo-app.add')) {
    const [msg] = extractMemoContent(action.memo, 'todo-app.add');
    if (!msg) {
      console.warn(`Skipping ${transaction.hash}, action is missing todo item to add`);
      return;
    }

    // Add data to state
    return;
  }

  if (action.memo.startsWith('todo-app.hide')) {
    // Handle remove action...
  }
});
```

<div class="abs-br m-6 text-xl">
  <a href="https://chronolibrary.com" target="_blank" class="slidev-icon-btn" title="Back to ChronoLibrary">
    <carbon:exit />
  </a>
  <a href="https://github.com/allinbits/chronolibrary" target="_blank" class="slidev-icon-btn" title="GitHub">
    <carbon:logo-github />
  </a>
</div>

---
transition: slide-left
---

# Utilize the Data

The storage and handling of data is entirely up to the provider or the client.

```ts
if (action.memo.startsWith('todo-app.add')) {
  const [msg] = extractMemoContent(action.memo, 'todo-app.add');
  if (!msg) {
    console.warn(`Skipping ${transaction.hash}, action is missing todo item to add`);
    return;
  }

  // You are given control on how to store this data.
  // You are given control on how to execute this action.
  // You are given control on whether or not you want anything to do with the action.
}
```

When the application state is replicable it means you as a provider, or client are in control of how to utilize it.

<div class="abs-br m-6 text-xl">
  <a href="https://chronolibrary.com" target="_blank" class="slidev-icon-btn" title="Back to ChronoLibrary">
    <carbon:exit />
  </a>
  <a href="https://github.com/allinbits/chronolibrary" target="_blank" class="slidev-icon-btn" title="GitHub">
    <carbon:logo-github />
  </a>
</div>

---
transition: slide-left
---

# Rebuild the Internet

ChronoLibrary gives you the tools to rebuild social interactions in new ways.

- Build systems for usernames
- Build systems for displaying avatars
- Build systems for personalization
- Build the next third-place

We can build it all, right on top of AtomOne. Limitations spark innovation.

<a href="https://chronolibrary.com/" target="_blank">Learn more about ChronoLibrary</a>

<div class="abs-br m-6 text-xl">
  <a href="https://chronolibrary.com" target="_blank" class="slidev-icon-btn" title="Back to ChronoLibrary">
    <carbon:exit />
  </a>
  <a href="https://github.com/allinbits/chronolibrary" target="_blank" class="slidev-icon-btn" title="GitHub">
    <carbon:logo-github />
  </a>
</div>