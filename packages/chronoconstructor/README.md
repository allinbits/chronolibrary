# ChronoConstructor

An web compatible action parsing library to bind prefix data to functions to reconstruct state on client-side.

## Install

```sh
pnpm i @atomone/chronoconstructor
```

## Usage

```ts
import { ChronoConstructor } from '@atomone/chronoconstructor';

const chronoConstructor = new ChronoConstructor<{ [hash: string]: string }>('TodoList');

// TodoList?a=ADD&c=this is my entry
chronoConstructor.addAction('ADD', (dataSet, action) => {
  const urlSearchParams = new URLSearchParams(action.memo.replace('TodoList?', ''));
  const content = urlSearchParams.get('c');
  if (!content) {
    console.warn(`Skipped ${action.hash}, content is missing from action`);
    return;
  }

  dataSet[action.hash] = content;
});

// TodoList?a=REMOVE&h=this_is_a_tx_hash_from_add
chronoConstructor.addAction('REMOVE', (dataSet, action) => {
  const urlSearchParams = new URLSearchParams(action.memo.replace('TodoList?', ''));
  const hash = urlSearchParams.get('h');
  if (!hash) {
    console.warn(`Skipped ${action.hash}, hash is missing from action`);
    return;
  }

  delete dataSet[hash];
});

const reconstructedState = await chronoConstructor.parse(actionDataGoesHere, originalStateGoesHere);
```