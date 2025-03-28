# TemporaState

TemporaState is a library designed to reconstruct past states and validate present actions in applications by leveraging event sourcing. It parses memos from individual blocks on-chain and reconstructs the state based on specific events. This allows applications to handle dynamic state changes driven by blockchain transactions through the cosmos banking module, specifically the transfer function.

## Key Concepts

- Event Sourcing: Event sourcing is a pattern where state is reconstructed by replaying a series of events. Instead of storing the current state of the application, you store the events that have occurred and reconstruct the state as needed. TemporaState uses this pattern to enable state reconstruction based on blockchain events.

- Memos: In the context of TemporaState, memos are used to invoke action states within the blockchain. A memo acts as a container for the information that an event contains, specifying which action should be performed and on what address.

- Action State: Action states are events that are triggered by the blockchain. These actions can be directed towards specific addresses that are responsible for handling them.

## How it Works

TemporaState integrates with blockchain events by parsing memos within blocks. It listens for specific prefixes in these memos, which signify different types of events. When a relevant memo is found, it triggers the corresponding function to allow for parsing that memo.

## Memo Structure

Memos are expected to follow a URLSearchParams-like structure, which is human-readable and familiar. The memo must have a prefix to help the event parser identify which events need to be processed.

```
0xForum?a=CREATE_THREAD&t=Some Title&c=Some Content
```

In this example, 0xForum is the prefix, indicating that the memo is related to a forum event (such as creating a thread). The query parameters (a, t, c) provide the details of the event, like the action type, title, and content of the thread.

## Setting Up TemporaState

Before setting up TemporaState for your specific needs check out if [TemporaSync](../temporasync/index) fits your needs for acting as a REST service, and an indexer for memos. For most developers this specific piece of software fits the bill for building.

However, if you're building something custom feel free to dig in further down.

### Installation

```
pnpm i @atomone/temporastate
```

### Setting Up an Instance

To start the block parsing system, follow the steps below. It is recommended to set a starting block number, which helps in reconstructing the state or creating live state from that point onward.

```ts
const endpoints = [
  `https://atomone-api.allinbits.com`,
  `https://atomone-rest.publicnode.com`,
];

// This function handles the action when a memo event is detected
function handleAction(action: Action) {
  console.log(action);
}

// This function starts the block parsing process. It retrieves the current block height,
// sets up a TemporaState instance that listens for memos with a specific prefix, and
// ensures the action is handled for a specific address.
async function parseBlocks() {
  const height = await getCurrentBlockHeight(endpoints);
  const min_height = `${parseInt(height) - 50}`;

  const temporaState = new TemporaState({
    API_URLS: endpoints,
    MEMO_PREFIX: "0xTest", // Optional prefix
    // RECEIVER: 'atone...', // Optional address
    // SENDER: 'atone...', // Optional address
    START_BLOCK: min_height,
    LOG: true,
  });

  temporaState.onAction(handleAction);
  await temporaState.start();

  // Alternatively you can specify an end block
  // await temporaState.start('12345678');
}
```

### Explanation of Setup

1. API URLs: The API_URLS array holds the URLs to the endpoints of the blockchain nodes you are querying. These nodes provide block data that TemporaState uses to extract events.

2. Memo Prefix: The MEMO_PREFIX tells TemporaState which memos to process. For example, if you are listening for forum-related events, you might set the prefix to 0xForum.

3. Start Block: The START_BLOCK indicates where to start parsing blocks from. It is recommended to start from the block right after the last one processed. You can retrieve the current block height using a helper function like getCurrentBlockHeight. **Keep in mind that not all API URLs contain all block state.**

4. Receiver and Sender (Optional): These fields are optional and can be used to filter events based on the recipient or sender's blockchain address.

5. Logging: The LOG parameter allows you to enable logging for debugging purposes. When LOG is set to true, all parsed events are logged to the console.

### Handling Actions

Once the instance is set up, TemporaState will begin parsing blocks and listening for memos with the specified prefix. The onAction method allows you to define a handler function that will be triggered whenever a relevant action is detected.

### Action Response Format

When TemporaState processes a memo, it triggers the handleAction function and passes an action object with the following structure:

```ts
{
  hash: '682defbf453ffe65a1a56f595fdadd9cc14e99b6e9b8a396bc924b9c69fc9d0b',
  from: 'atone16k0xnxqr48qdwxreu6rgcghg0xp9hn7vpn06nm',
  to: 'atone1uq6zjslvsa29cy6uu75y8txnl52mw06j6fzlep',
  memo: '0xTest',
  amounts: [
    { denom: 'uatone', amount: '1000000' }
  ],
  timestamp: '2025-03-18T14:45:37.323011612Z',
  height: '2267005'
}
```

## How Event Sourcing Works
Event sourcing relies on the concept of recording each state transition as an event. Instead of storing just the current state, every change in state is stored as a sequence of immutable events. These events can be replayed at any time to reconstruct the state of the application.

### Example Workflow:

1. Initial State: The initial state of the application is empty or default.

2. Event Occurs: A user action triggers an event (e.g., creating a forum thread).

3. Event is Stored: The event is stored on the blockchain with a memo that contains details about the action.

4. State Reconstruction: The event is parsed by TemporaState, and the state is updated accordingly.

By using TemporaState, you can ensure that your application's state is consistent and can be reconstructed at any point in the past, making it more resilient to changes in the system.