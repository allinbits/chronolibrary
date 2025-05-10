<script setup lang="ts">
import { watch } from 'vue';

import Games from './components/Games.vue';
import { useChronoState } from './composables/useChronoState';
import { useKeplr } from './composables/useKeplr';

const keplr = useKeplr();
const state = useChronoState();

watch(() => keplr.isConnected, () => {
    if (keplr.isConnected) {
        state.start();
    }
    else {
        state.stop();
    }
});

</script>

<template>
  <div class="flex flex-col w-screen h-screen bg-white overflow-x-hidden text-black items-center py-12">
    <div class="flex flex-col w-[800px]">
      <div class="flex flex-row w-full justify-between border pl-6">
        <div class="flex flex-row flex-grow items-center">
          <span class="text-2xl font-bold">Tic Tac Photon</span>
        </div>
        <div class="flex flex-row items-center gap-6">
          <span v-if="keplr.isConnected">{{ keplr.account?.slice(0, 8) + '...' + keplr.account?.slice(keplr.account.length - 8, keplr.account.length) }}</span>
          <button class="bg-neutral-950 text-white py-4 px-6 cursor-pointer hover:bg-neutral-700 w-42" @click="keplr.connectWallet" v-if="!keplr.isConnected">Connect</button>
          <button class="bg-neutral-950 text-white py-4 px-6 cursor-pointer hover:bg-neutral-700 w-42" @click="keplr.disconnectWallet" v-else>Disconnect</button>
        </div>
      </div>
      <div class="flex flex-col w-[800px] border-x border-b p-6">
        <template v-if="!keplr.isConnected">
          <span>Connect your wallet to start or view your games.</span>
        </template>
        <template v-else>
          <Games />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
