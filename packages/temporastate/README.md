# TemporaState

Reconstructing the past, validating the present, securing the future.

TemporaState is a library which parses memos from individual blocks on-chain and then is meant to use the event sourcing pattern to reconstruct and give applications specific instructions to reconstruct state.

## How?

Using the default cosmos banking module, a memo can be used to invoke action state.

Action state can be targeted towards a specific public address which wants to handle the action state. 

It is recommended to use URLSearchParams for `memos` as they are human readable and familiar. However, nothing is stopping you from using your own formatting system.

The only requirement is that you have a prefix for your memos; which helps the event parser find information about events.

**Example**

```js
0xForum?a=CREATE_THREAD&t=Some Title&c=Some Content
```

## How does this library work?

```
pnpm i @atomone/temporastate
```

### Setting up an Instance

This is how you setup TemporaState and start the block parsing system. It's recommended to have a starting block number, and use that to reconstruct the rest of the state, or create live state based on that.

```ts
const endpoints = [`https://atomone-api.allinbits.com/`, `https://atomone-rest.publicnode.com`];

// This function takes incoming memos from blocks being parsed
function handleAction(action: Action) {
    console.log(action);
}

// This function starts the block parsing process by getting current block height,
// Then sets up a TemporaState instance that looks for messages with a prefix of 0xTest
// It also checks to ensure the receiver is a specific address.
// We give it a minimum height to start processing blocks from, usually last block processed.
async function parseBlocks() {
    const height = await getCurrentBlockHeight(endpoints);
    const min_height = `${parseInt(height) - 50}`;

    const temporaState = new TemporaState({
        API_URLS: endpoints,
        MEMO_PREFIX: '0xTest',
        // RECEIVER: 'atone1uq6zjslvsa29cy6uu75y8txnl52mw06j6fzlep', // These are optional
        // SENDER: 'atone1uq6zjslvsa29cy6uu75y8txnl52mw06j6fzlep', // These are optional
        START_BLOCK: min_height,
        LOG: true,
    });

    temporaState.onAction(handleAction);
    await temporaState.start();
}
```

### Getting an Action Response

This is what you can expect from the handle action function when logging results.

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
