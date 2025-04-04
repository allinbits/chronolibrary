---
order: 98
outline: 'deep'
---

# How to Plan

When you're building an event source application on AtomOne you'll likely want to lay out the necessary building blocks for your individual application.

It requires thinking in a slightly different way, but it's quite straight forward.

## Understand Constraints

- Memos can only be 255 characters in length

- Memos can be pruned depending on the API provider, not all API providers run full nodes

- What is posted on-chain is there forever, nothing can remove it. Only an action can `hide` it from the client view.

## Plan the Memos

The first step you should take is layout all of the necessary memos you're going to be using.

Here's an example of a forum application.

```ts
// Create Thread
0xForum?a=0&t=myTitle&c=my+content

// Reply to Thread
0xForum?a=1&th=threadHash&c=my+content

// Delete Reply (If Owner)
0xForum?a=2&th=threadHash&mh=messageHash

// Delete Thread (If Owner)
0xForum?a=3&th=threadHash

// Upvote Message
0xForum?a=4&th=threadHash&mh=messageHash

// Remove Upvote from Message
0xForum?a=5&th=threadHash&mh=messageHash
```

All of the above allows you to easily construct a forum with threads, replies, and a simple upvote system.

## Build the Memos

Once you have the memos built out, it's recommended to build all of the necessary functional actions to modify the state.

Use the [Constructor Library](../constructor/index.md) to easily bind actions to functions.

Below is an example from a Todo List Application:

```ts
const constructor = new ChronoConstructor<{ [hash: string]: string }>('TodoList');

// TodoList?a=ADD&c=this is my entry
constructor.addAction('ADD', (dataSet, action) => {
  const urlSearchParams = new URLSearchParams(action.memo.replace('TodoList?', ''));
  const content = urlSearchParams.get('c');
  if (!content) {
    console.warn(`Skipped ${action.hash}, content is missing from action`);
    return;
  }

  dataSet[action.hash] = content;
});

// TodoList?a=ADD&h=this_is_a_hash_from_add
constructor.addAction('REMOVE', (dataSet, action) => {
  const urlSearchParams = new URLSearchParams(action.memo.replace('TodoList?', ''));
  const hash = urlSearchParams.get('h');
  if (!hash) {
    console.warn(`Skipped ${action.hash}, hash is missing from action`);
    return;
  }

  delete dataSet[hash];
});

async function update() {
  // Note that actionList is not defined, and assumes you're pulling from a localhost instance.
  // Additionally actionList is either the full list, or partial
  // Existing state is either a new instance, or an existing instance
  state.value = await constructor.parse(actionList, existingState);
}

update();
```
