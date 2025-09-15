import { Config } from '../types';
import { BlockResponse } from '../types/block';
import { TransactionResponse } from '../types/transaction';

const MAX_FETCH_RETRIES = 3;
const TIME_BETWEEN_RETRIES = 2000;

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
    await new Promise((resolve: Function) => setTimeout(resolve, TIME_BETWEEN_RETRIES * retries));
    return handleFetchRequest(apiURLs, path, retries);
}

export async function getCurrentBlockHeight(config: Config) {
    const result = await handleFetchRequest<{ block: { header: { height: string } } }>(
        config.API_URLS, 
        `${config.BLOCKS_PATH}/latest`
    );

    return result?.block.header.height ?? undefined;
}

export async function getBlockByHeight(config: Config, blockHeight: number) {
    return handleFetchRequest<BlockResponse>(
        config.API_URLS,
        `${config.BLOCKS_PATH}/${blockHeight}`
    );
}

export async function getTransaction(config: Config, txHash: string) {
    return handleFetchRequest<TransactionResponse>(
        config.API_URLS,
        `${config.TRANSACTION_PATH}/${txHash.toUpperCase()}`
    );
}
