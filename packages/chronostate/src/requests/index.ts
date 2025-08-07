import { BlockResponse } from '../types/block';
import { TransactionResponse } from '../types/transaction';

const MAX_FETCH_RETRIES = 3;

async function handleFetchRequest<T>(apiURLs: string[], path: string, retries = 0) {
    if (retries >= MAX_FETCH_RETRIES) {
        throw new Error(`Failed to fetch current block height, all API urls have failed. Retry ${retries}`);
    }

    for (let api of apiURLs) {
        const response = await fetch(`${api}${path}`).catch((err) => {
            console.error(err);
            return undefined;
        });

        if (!response || response.status !== 200) {
            console.warn(`Failed Request | Code ${response?.status} | ${response?.statusText}`)
            continue;
        }

        return response.json() as T;
    }

    retries += 1;
    return handleFetchRequest(apiURLs, path, retries + 1);
}

export async function getCurrentBlockHeight(apiURLs: string[]) {
    const result = await handleFetchRequest<{ block: { header: { height: string } } }>(apiURLs, '/cosmos/base/tendermint/v1beta1/blocks/latest');
    if (!result) {
        return undefined;
    }

    return result.block.header.height;
}

export async function getBlockByHeight(apiURLs: string[], blockHeight: number, retries = 0) {
    return handleFetchRequest<BlockResponse>(apiURLs, `/cosmos/base/tendermint/v1beta1/blocks/${blockHeight}`)
}

export async function getTransaction(apiURLs: string[], txHash: string, retries = 0) {
    return handleFetchRequest<TransactionResponse>(apiURLs, `/cosmos/tx/v1beta1/txs/${txHash.toUpperCase()}`)
}
