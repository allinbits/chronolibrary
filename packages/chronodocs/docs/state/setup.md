---
order: 98
outline: "deep"
---

# Setup ChronoState

Before setting up ChronoState for your specific needs check out if [ChronoSync](../sync/index) fits your needs for acting as a REST service, and an indexer for memos. For most developers this specific piece of software fits the bill for building.

However, if you're building something custom feel free to dig in further down.

### Installation

```
pnpm i @atomone/chronostate
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
// sets up a ChronoState instance that listens for memos with a specific prefix, and
// ensures the action is handled for a specific address.
async function parseBlocks() {
  const height = await getCurrentBlockHeight(endpoints);
  const min_height = `${parseInt(height) - 50}`;

  const state = new ChronoState({
    API_URLS: endpoints,
    MEMO_PREFIX: "0xTest", // Optional prefix
    // RECEIVER: 'atone...', // Optional address, this limits transactions to bank module transactions
    // SENDER: 'atone...', // Optional address, this limits transactions to bank module transactions
    START_BLOCK: min_height,
    LOG: true,
  });

  state.onAction(handleAction);
  await state.start();

  // Alternatively you can specify an end block
  // await state.start('12345678');
}
```

### Explanation of Setup

1. API URLs: The API_URLS array holds the URLs to the endpoints of the blockchain nodes you are querying. These nodes provide block data that ChronoState uses to extract events.

2. Memo Prefix: The MEMO_PREFIX tells ChronoState which memos to process. For example, if you are listening for forum-related events, you might set the prefix to 0xForum.

3. Start Block: The START_BLOCK indicates where to start parsing blocks from. It is recommended to start from the block right after the last one processed. You can retrieve the current block height using a helper function like getCurrentBlockHeight. **Keep in mind that not all API URLs contain all block state.**

4. Receiver and Sender (Optional): These fields are optional and can be used to filter events based on the recipient or sender's blockchain address.

5. Logging: The LOG parameter allows you to enable logging for debugging purposes. When LOG is set to true, all parsed events are logged to the console.

### Handling Actions

Once the instance is set up, ChronoState will begin parsing blocks and listening for memos with the specified prefix. The onAction method allows you to define a handler function that will be triggered whenever a relevant action is detected.

### Action Response Format

When ChronoState processes a memo, it triggers the handleAction function and passes an action object with the following structure:

```ts
{
  hash: '682defbf...',
  memo: 'forum.CreateThread("My Title","My Body")',
  timestamp: '2025-03-18T14:45:37.323011612Z',
  height: '2267005',
  messages: [
    {
      "@type": "/cosmos.bank.v1beta1.MsgSend",
      "from_address": "atone16...",
      "to_address": "atone1u...",
      "amount": [
        {
          "denom": "uatone",
          "amount": "1"
        }
      ]
    }
  ]
}
```
