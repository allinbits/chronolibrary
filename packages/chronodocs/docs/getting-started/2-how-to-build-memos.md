---
order: 98
outline: 'deep'
---

# 2. Building Memos

Once you have the memos built out, it's recommended to build all of the necessary functional actions to modify the state.

Either on the client-side in the SPA, or in your own application instance is where you should parse the memos.

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