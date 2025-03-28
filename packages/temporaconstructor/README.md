# TemporaConstructor

An web compatible action parsing library to bind prefix data to functions to reconstruct state on client-side.

## Install

```sh
pnpm i @allinbits/temporaconstructor
```

## Usage

```ts
import { TemporaConstructor } from '@atomone/temporaconstructor';

const temporaConstructor = new TemporaConstructor<{ [hash: string]: string }>('TodoList');

// TodoList?a=ADD&c=this is my entry
temporaConstructor.addAction('ADD', (dataSet, action) => {
  const urlSearchParams = new URLSearchParams(action.memo.replace('TodoList?', ''));
  const content = urlSearchParams.get('c');
  if (!content) {
    console.warn(`Skipped ${action.hash}, content is missing from action`);
    return;
  }

  dataSet[action.hash] = content;
});

// TodoList?a=REMOVE&h=this_is_a_tx_hash_from_add
temporaConstructor.addAction('REMOVE', (dataSet, action) => {
  const urlSearchParams = new URLSearchParams(action.memo.replace('TodoList?', ''));
  const hash = urlSearchParams.get('h');
  if (!hash) {
    console.warn(`Skipped ${action.hash}, hash is missing from action`);
    return;
  }

  delete dataSet[hash];
});

const reconstructedState = await temporaConstructor.parse(actionDataGoesHere, originalStateGoesHere);
```