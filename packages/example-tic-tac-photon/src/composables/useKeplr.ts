import type { OfflineSigner } from '@cosmjs/proto-signing';

import { ref } from 'vue';
import { coins, SigningStargateClient } from '@cosmjs/stargate';
import { defineStore } from 'pinia';

import chainInfo from '../chain-config.json';

export const useKeplr = defineStore('keplr-wallet', () => {
    const isKeplrInstalled = ref(false);
    const isConnected = ref(false);
    const account = ref<string | null>(null);

    isKeplrInstalled.value = !!window.keplr;

    const connectWallet = async () => {
        if (!window.keplr) {
            alert('Please install the Keplr browser extension.');
            return;
        }

        try {
            await window.keplr.enable(chainInfo.chainId);
            const offlineSigner = window.keplr.getOfflineSigner(chainInfo.chainId);

            // Get the accounts
            const accounts = await offlineSigner.getAccounts();
            if (accounts.length > 0) {
                account.value = accounts[0].address;
                isConnected.value = true;
            }
            else {
                console.warn('No accounts found in Keplr.');
                isConnected.value = false;
                account.value = null;
            }
        }
        catch (error) {
            console.error('Error connecting to Keplr:', error);
            isConnected.value = false;
            account.value = null;
        }
    };

    const disconnectWallet = () => {
        isConnected.value = false;
        account.value = null;
    };

    const getSigningClient = async (chainId: string) => {
        if (!window.keplr || !isConnected.value) {
            console.warn('Keplr not installed or wallet not connected.');
            return null;
        }
        try {
            return window.keplr.getOfflineSigner(chainId);
        }
        catch (error) {
            console.error(`Error getting signing client for chain ${chainId}:`, error);
            return null;
        }
    };

    const signTransaction = async (memo: string) => {
        try {
            const signer = await getSigningClient(chainInfo.chainId);
            const client = await SigningStargateClient.connectWithSigner(chainInfo.rpc, signer as OfflineSigner);
            const simulate = await client.simulate(
                account.value as string,
                [
                    {
                        typeUrl: '/cosmos.bank.v1beta1.MsgSend',
                        value: {
                            fromAddress: account.value,
                            toAddress: 'atone1uq6zjslvsa29cy6uu75y8txnl52mw06j6fzlep',
                            amount: coins(1, chainInfo.feeCurrencies[0].coinMinimalDenom),
                        },
                    },
                ],
                memo,
            );

            const gasLimit = simulate && simulate > 0 ? '' + Math.ceil(simulate * 2.0) : '500000';
            const result = await client.sendTokens(
                account.value as string, // From
                'atone1uq6zjslvsa29cy6uu75y8txnl52mw06j6fzlep', // To
                [{ amount: '1', denom: chainInfo.feeCurrencies[0].coinMinimalDenom }], // Amount
                { amount: [{ amount: '10000', denom: 'uphoton' }], gas: gasLimit }, // Gas
                memo,
            );

            return result;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    };

    return {
        isKeplrInstalled,
        isConnected,
        account,
        connectWallet,
        disconnectWallet,
        getSigningClient,
        signTransaction,
    };
});
