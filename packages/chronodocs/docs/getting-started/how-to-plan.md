---
order: 98
outline: 'deep'
---

# How to Plan

When you're building an event source application on AtomOne you'll likely want to lay out the necessary building blocks for your individual application.

It requires thinking in a slightly different way, but it's quite straight forward.

## Understand Constraints

- Memos can only be 512 bytes

- Memos can be pruned depending on the API provider, not all API providers run nodes with all history maintained

- What is posted on-chain is there forever, nothing can remove it. Only an action can `hide` it from the client view

## Plan the Memos

The first step you should take is layout all of the necessary memos you're going to be using.

Here's an example of a forum application.

```ts
// Create Thread
forum.Create("title", "content")

// Reply to Thread
forum.Reply("thread_hash", "content")

// Delete Reply (If Owner)
forum.ReplyDelete("thread_hash", "msg_hash")

// Delete Thread (If Owner)
froum.ThreadDelete("thread_hash")

// Upvote Message / Thread
forum.Upvote("thread_hash", "optional_msg_hash");

// Remove Upvote from Message / Thread
forum.Unvote("thread_hash", "optiona_msg_hash")
```

All of the above allows you to easily construct a forum with threads, replies, and a simple upvote system.

## Build the Memos

Once you have the memos built out, it's recommended to build all of the necessary functional actions to modify the state.

Use the [Constructor Library](../constructor/index.md) to easily bind actions to functions.

Below is an example from a Todo List Application:

```ts
const constructor = new ChronoConstructor<{ [hash: string]: string }>();

// todo.Add("this is my todo list item")
constructor.addAction('Add', (dataSet, action) => {
  const [arg1] = extractMemoContent(action.memo, 'example.add');
  if (!arg1) {
    console.warn(`Skipped ${action.hash}, content is missing args`);
    return;
  }

  dataSet[action.hash] = arg1;
});

// todo.Remove("hash_from_tx_for_add")
constructor.addAction('Remove', (dataSet, action) => {
 const [hash] = extractMemoContent(action.memo, 'example.add');
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

## Deploy a ChronoSync Instance

There's a few different flavors of ChronoSync that will allow you to start indexing memos.

However, how you serve them is up to you and your individual needs.

I highly recommend the Postgres ChronoSync mixed with PostgREST for a quick startup.

Learn more about [ChronoSync](../sync/index.md).