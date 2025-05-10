# Tic Tac Photon

It's just tic-tac-toe but it runs off the test network.

Additionally, uses ChronoState to synchronize chain state.

_It's highly recommended that this is deployed with an actual server._

## Initialize a Game

Send a transaction to `atone1uq6zjslvsa29cy6uu75y8txnl52mw06j6fzlep` with the memo:

```ts
TicTac.Play("address_to_play_against")
```

When you connect your wallet in the browser, it will begin synchronizing blocks.

If you want to synchronize blocks faster edit `src/composables/useChronoState.ts` and set it to a block closer to your game start time.

## Usage

```
pnpm install
```

```
pnpm dev
```
