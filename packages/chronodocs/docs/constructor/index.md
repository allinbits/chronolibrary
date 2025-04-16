# Constructor

An web compatible action parsing library to bind prefix data to functions to reconstruct state on client-side.

This is a library that is used to help reconstruct state in a specific way by binding function names to functions in JavaScript / TypeScript.

## Install

```sh
pnpm i @atomone/chronoconstructor
```

## Usage

Below is a simple example usage for adding and subtracting and then storing the results mapped to a transaction hash.

```ts
import { ChronoConstructor, extractMemoContent } from '@atomone/chronoconstructor';

const state = new ChronoConstructor<{ [hash: string]: string }>();

// example.add("5", "5");
state.addAction('add', (dataSet, action) => {
  const [arg1, arg2] = extractMemoContent(action.memo, 'example.add');
  if (!arg1 || !arg2) {
    console.warn(`Skipped ${action.hash}, content is missing args`);
    return;
  }

  const result = parseFloat(arg1) + parseFloat(arg2);
  dataSet[action.hash] = result;
});

// example.sub("5", "5");
state.addAction('sub', (dataSet, action) => {
  const [arg1, arg2] = extractMemoContent(action.memo, 'example.sub');
  if (!arg1 || !arg2) {
    console.warn(`Skipped ${action.hash}, content is missing args`);
    return;
  }

  const result = parseFloat(arg1) - parseFloat(arg2);
  dataSet[action.hash] = result;
});

const reconstructedState = await chronoConstructor.parse(actionDataGoesHere, originalStateGoesHere);
```