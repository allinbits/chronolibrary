import { Config } from '../types';
import { BlockResponse } from '../types/block';
import { TransactionResponse } from '../types/transaction';

const MAX_FETCH_RETRIES = 3;

export async function getCurrentBlockHeight(apiUrls: string[], retries = 0) {
    if (retries >= MAX_FETCH_RETRIES) {
        throw new Error(`Failed to fetch current block height, all API urls have failed. Retry ${retries}`);
    }

    for (let api of apiUrls) {
        const response = await fetch(`${api}/cosmos/base/tendermint/v1beta1/blocks/latest`).catch((err) => {
            console.error(err);
            return undefined;
        });

        if (!response || response.status !== 200) {
            console.warn(`Failed Request | Code ${response?.status} | ${response?.statusText}`)
            continue;
        }

        const data = (await response.json()) as { block: { header: { height: string } } };
        return data.block.header.height;
    }

    retries += 1;
    return getCurrentBlockHeight(apiUrls, retries + 1);
}

export async function getBlockByHeight(apiUrls: string[], blockHeight: number, retries = 0) {
    if (retries >= MAX_FETCH_RETRIES) {
        throw new Error(`Failed to fetch block height ${blockHeight}, all API urls have failed. Retry ${retries}`);
    }

    for (let api of apiUrls) {
        const response = await fetch(`${api}/cosmos/base/tendermint/v1beta1/blocks/${blockHeight}`).catch((err) => {
            console.error(err);
            return undefined;
        });

        if (!response || response.status !== 200) {
            console.warn(`Failed Request | Code ${response?.status} | ${response?.statusText}`)
            continue;
        }

        return (await response.json()) as BlockResponse;
    }

    return getBlockByHeight(apiUrls, blockHeight, retries + 1);
}

export async function getTransaction(config: Config, txHash: string, retries = 0) {
    if (retries >= MAX_FETCH_RETRIES) {
        throw new Error(`Failed to fetch current block height, all API urls have failed. Retry ${retries}`);
    }

    for (let api of config.API_URLS) {
        const response = await fetch(`${api}/cosmos/tx/v1beta1/txs/${txHash.toUpperCase()}`).catch((err) => {
            console.error(err);
            return undefined;
        });

        if (!response || response.status !== 200) {
            console.warn(`Failed Request | Code ${response?.status} | ${response?.statusText}`)
            continue;
        }

        return (await response.json()) as TransactionResponse;
    }

    retries += 1;
    return getTransaction(config, txHash, retries + 1);
}
