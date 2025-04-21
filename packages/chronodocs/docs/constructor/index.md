# ChronoConstructor

An web compatible action parsing library to bind prefix data to functions to reconstruct state on client-side.

This is a library that is used to help reconstruct state in a specific way by binding function names to functions in JavaScript / TypeScript.

## Install

```sh
pnpm i @atomone/chronoconstructor
```

## Calculator Example

Below is a simple example usage for adding and subtracting and then storing the results mapped to a transaction hash.

```ts
import {
  ChronoConstructor,
  extractMemoContent,
} from "@atomone/chronoconstructor";

const state = new ChronoConstructor<{ [hash: string]: string }>();
let startingState = {};

// example.add("5", "5");
state.addAction("add", (dataSet, action) => {
  const [arg1, arg2] = extractMemoContent(action.memo, "example.add");
  if (!arg1 || !arg2) {
    console.warn(`Skipped ${action.hash}, content is missing args`);
    return;
  }

  const result = parseFloat(arg1) + parseFloat(arg2);
  dataSet[action.hash] = result;
});

// example.sub("5", "5");
state.addAction("sub", (dataSet, action) => {
  const [arg1, arg2] = extractMemoContent(action.memo, "example.sub");
  if (!arg1 || !arg2) {
    console.warn(`Skipped ${action.hash}, content is missing args`);
    return;
  }

  const result = parseFloat(arg1) - parseFloat(arg2);
  dataSet[action.hash] = result;
});

async function update() {
  let startingState = await chronoConstructor.parse(
    dataFromChronoSyncHere,
    startingState
  );
}

update();
```

## Forum Example

```ts
import {
  ChronoConstructor,
  extractMemoContent,
} from "@atomone/chronoconstructor";

// Define the state structure for the forum
const forumState = new ChronoConstructor<{
  [postId: string]: {
    title: string;
    content: string;
    author: string;
    timestamp: number;
  };
}>();

let startingState = {};

// Action to add a new post
forumState.addAction("addPost", (dataSet, action) => {
  const [title, content, author] = extractMemoContent(
    action.memo,
    "forum.addPost"
  );
  if (!title || !content || !author) {
    console.warn(`Skipped ${action.hash}, content is missing args`);
    return;
  }

  const postId = action.hash;
  dataSet[postId] = { title, content, author, timestamp: Date.now() };
});

// Action to edit an existing post
forumState.addAction("editPost", (dataSet, action) => {
  const [postId, newTitle, newContent] = extractMemoContent(
    action.memo,
    "forum.editPost"
  );
  if (!postId || !newTitle || !newContent) {
    console.warn(`Skipped ${action.hash}, content is missing args`);
    return;
  }

  if (dataSet[postId]) {
    dataSet[postId].title = newTitle;
    dataSet[postId].content = newContent;
    dataSet[postId].timestamp = Date.now();
  } else {
    console.warn(`Post with ID ${postId} does not exist`);
  }
});

// Action to delete a post
forumState.addAction("deletePost", (dataSet, action) => {
  const [postId] = extractMemoContent(action.memo, "forum.deletePost");
  if (!postId) {
    console.warn(`Skipped ${action.hash}, content is missing args`);
    return;
  }

  if (dataSet[postId]) {
    delete dataSet[postId];
  } else {
    console.warn(`Post with ID ${postId} does not exist`);
  }
});

async function updateForumState() {
  let startingState = await forumState.parse(
    dataFromChronoSyncHere,
    startingState
  );
}

updateForumState();
```

## Avatar Registry

```ts
import {
  ChronoConstructor,
  extractMemoContent,
} from "@atomone/chronoconstructor";

// Define the state structure for the avatar registry
const avatarRegistry = new ChronoConstructor<{
  [fromAddress: string]: string;
}>();

let startingState = {};

avatarRegistry.addAction("update", (dataSet, action) => {
  const msgSendMessage = action.messages.find(
    (msg) => msg["@type"] === "/cosmos.bank.v1beta1.MsgSend"
  );
  if (!msgSendMessage) {
    console.warn(`Skipped ${action.hash}, no MsgSend message found`);
    return;
  }

  const fromAddress = msgSendMessage.from_address;
  const [imgurUrl] = extractMemoContent(action.memo, "avatar.update");
  if (!fromAddress || !imgurUrl) {
    console.warn(`Skipped ${action.hash}, content is missing args`);
    return;
  }

  const imgurPattern =
    /^https:\/\/i\.imgur\.com\/[a-zA-Z0-9]+\.(jpg|jpeg|png|gif)$/i;
  if (!imgurPattern.test(imgurUrl)) {
    console.warn(`Invalid Imgur URL: ${imgurUrl}, skipped`);
    return;
  }

  dataSet[fromAddress] = imgurUrl;
});

async function updateAvatarRegistry() {
  let startingState = await avatarRegistry.parse(
    dataFromChronoSyncHere,
    startingState
  );
}

updateAvatarRegistry();
```
