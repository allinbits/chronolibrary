---
order: 98
outline: 'deep'
---

# 1. Planning Memos

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
forum.ThreadDelete("thread_hash")

// Upvote Message / Thread
forum.Upvote("thread_hash", "optional_msg_hash");

// Remove Upvote from Message / Thread
forum.Unvote("thread_hash", "optiona_msg_hash")
```

All of the above allows you to easily construct a forum with threads, replies, and a simple upvote system.