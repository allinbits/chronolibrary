<script lang="ts" setup>
import { computed } from 'vue';

import { useChronoState } from '../composables/useChronoState';
import { useKeplr } from '../composables/useKeplr';
import { getGameBoard, getGamePiece, type TicTacGame } from '../shared/game';

const keplr = useKeplr();
const state = useChronoState();

const existingGames = computed(() => {
    return state.games.value;
});

const lastBlock = computed(() => {
    return state.lastBlock.value;
});

function getCurrentMove(game: TicTacGame) {
    return (game.current_move === 'author' && keplr.account === game.author) || (game.current_move === 'opponent' && keplr.account === game.opponent) ? 'You' : 'Opponent';
}

function isYourTurn(game: TicTacGame) {
    return getCurrentMove(game) === 'You';
}

async function playPiece(position: number, game: TicTacGame) {
    await keplr.signTransaction(`TicTac.Move("${game.hash}","${position}")`);
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <template v-if="existingGames.length >= 1">
      <div class="flex border p-2 items-center justify-center">Syncing Blocks... {{ lastBlock }}</div>
      <div v-for="(game, index) in existingGames" :key="index" class="flex flex-col border">
        <div class="flex flex-row gap-2 border-b p-2 justify-between">
          <span><strong>VS</strong> {{ game.author === keplr.account ? game.opponent : game.author }}</span>
          <span>{{ game.hash.slice(game.hash.length - 12, game.hash.length - 1) }}</span>
        </div>
        <div class="flex flex-row p-2 border-b">
          <span><strong>Current Move:</strong> {{ getCurrentMove(game) }}</span>
        </div>
        <div class="flex flex-row p-2 border-b">
          <span><strong>Your Piece:</strong> {{ getGamePiece(keplr.account as string, game) }}</span>
        </div>
        <div class="flex flex-row p-2 border-b" v-if="game.winner">
          <span><strong>Winner:</strong> {{ game.winner }}</span>
        </div>
        <div class="flex flex-col py-6 gap-2">
          <div v-for="(row, rowIndex) in getGameBoard(game.moves)" :key="rowIndex" class="flex flex-row gap-2 w-full h-32 items-center justify-center" >
            <div  v-for="(gamePiece, colIndex) in row" :key="colIndex"
                  class="flex items-center justify-center w-32 border h-full gap-2"
                  :class="isYourTurn(game) && gamePiece === null ? ['cursor-pointer', 'hover:scale-95'] : []"
                  @click="isYourTurn(game) && gamePiece === null ? playPiece(rowIndex * row.length + colIndex, game) : () => {}"
            >
              {{ gamePiece === null ? 'Open' : gamePiece }}
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="flex border p-2 items-center justify-center">Loading Games... {{ lastBlock }}</div>
    </template>
  </div>
</template>
