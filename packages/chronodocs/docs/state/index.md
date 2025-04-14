---
order: 99
outline: 'deep'
---

# ChronoState

ChronoState is a library designed to reconstruct past states and validate present actions in applications by leveraging event sourcing. It parses memos from individual blocks on-chain and reconstructs the state based on specific events. This allows applications to handle dynamic state changes driven by blockchain transactions through the cosmos banking module, specifically the transfer function.

## Key Concepts

- Event Sourcing: Event sourcing is a pattern where state is reconstructed by replaying a series of events. Instead of storing the current state of the application, you store the events that have occurred and reconstruct the state as needed. ChronoState uses this pattern to enable state reconstruction based on blockchain events.

- Memos: In the context of ChronoState, memos are used to invoke action states within the blockchain. A memo acts as a container for the information that an event contains, specifying which action should be performed and on what address.

- Action State: Action states are events that are triggered by the blockchain. These actions can be directed towards specific addresses that are responsible for handling them.

## How it Works

ChronoState integrates with blockchain events by parsing memos within transactions in the cosmos banking module. It listens for specific prefixes in these memos, which signify different types of events. 

When a relevant memo is found, it triggers the corresponding function to allow for parsing that memo.

## Memo Structure

Memos are expected to follow a general function call which looks like the following:

```
somenamespace.SomeFunction("some argument","another argument")
```

In this example, somenamespace is the prefix.

## How Event Sourcing Works

Event sourcing relies on the concept of recording each state transition as an event. Instead of storing just the current state, every change in state is stored as a sequence of immutable events. These events can be replayed at any time to reconstruct the state of the application.

### Example Workflow:

1. Initial State: The initial state of the application is empty or default.

2. Event Occurs: A user action triggers an event on-chain (e.g., creating a forum thread).

3. Event is Stored: The event is stored on the blockchain with a memo that contains details about the action.

4. Memo Listener: The event is parsed by ChronoState, and consumed through the `onAction` function

5. Store the Memo: The event is stored in a database in the order in which it is received.

6. Read Memos: A client application reads the memos in the order which they were received and reconstructs the application state.