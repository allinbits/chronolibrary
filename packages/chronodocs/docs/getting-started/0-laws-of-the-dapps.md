---
order: 98
outline: 'deep'
---

# 0. Laws of State

There are general laws you need to understand when building anything that has to do with ChronoState.

This section is meant to highlight what those rules are, and why you should abide by them in your application.

## Actions are Instructions

When you post a memo with a specific function call that is an instruction for the client or your indexing service to parse.

Every indexing service or client is meant to parse that data as well.

## Actions are Parsed in Order

All actions are always processed in order, meaning that the order of operations posted to the chain are a set of instructions for the client or your indexing service to utilize.

This is how we create reproducible action state.

Actions that are parsed out of order may result in incorrect state for indivdual client applications.

## Actions are Stored Forever

When an action is posted to the chain in a memo it will be there forever. Ensure that your application isn't posting garbage to the chain.

## Actions can be Faulty

There is a chance that a bad actor can come in and post garbage actions to the chain using your messages.

Your application needs to be setup in such a way to handle those actions.

Here are some **basic guidelines** on how to handle it:

- Throw away malformed messages.
- Throw away messages that don't have all parameters.
- Throw away messages that don't have the correct function name.
- Throw away messages that do not meet your criteria for 'from', 'to', etc.

## Namespaces can be Extended

It's good to keep in mind that the community may take your ChronoState based application and extend upon it.

This means that they can build new functions which may not be handled by your application.

This is why we only parse messages that can be handled by your application.