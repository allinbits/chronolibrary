import { Config } from '../types';
import { BlockResponse } from '../types/block';
import { TransactionResponse } from '../types/transaction';

const MAX_FETCH_RETRIES = 3;

export async function getCurrentBlockHeight(apiUrls: string[]) {
    for (let api of apiUrls) {
        const response = await fetch(`${api}/cosmos/base/tendermint/v1beta1/blocks/latest`).catch((err) => {
            return { ok: false, error: err };
        });

        if (!response.ok || !(response instanceof Response)) {
            console.warn(`Failed to retrieve current block height from ${api}`);
            continue;
        }

        const data = (await response.json()) as { block: { header: { height: string } } };
        return data.block.header.height;
    }

    throw new Error(`Failed to fetch current block height, all API urls have failed`);
}

export async function getBlockByHeight(apiUrls: string[], blockHeight: number, retries = 0) {
    if (retries >= MAX_FETCH_RETRIES) {
        throw new Error(`Failed to fetch block height ${blockHeight}, all API urls have failed. Retry ${retries}`);
    }

    for (let api of apiUrls) {
        const response = await fetch(`${api}/cosmos/base/tendermint/v1beta1/blocks/${blockHeight}`).catch(err => {
            console.warn(err);
            return undefined;
        })

        if (!response?.ok) {
            console.warn(`Failed to retrieve block height for ${blockHeight} from ${api}`);
            continue;
        }

        return (await response.json()) as BlockResponse;
    }

    return getBlockByHeight(apiUrls, blockHeight, retries + 1);
}

export async function getTransaction(config: Config, txHash: string) {
    for (let api of config.API_URLS) {
        const txResponse = await fetch(`${api}/cosmos/tx/v1beta1/txs/${txHash.toUpperCase()}`);

        if (!txResponse.ok) {
            continue;
        }

        return (await txResponse.json()) as TransactionResponse;
    }

    throw new Error(`Failed to fetch transaction ${txHash}, all API urls have failed`);
}
