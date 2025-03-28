import { Config } from '../types';
import { BlockResponse } from '../types/block';
import { TransactionResponse } from '../types/transaction';
import { decodeUnicode } from '../utility';

export async function getCurrentBlockHeight(apiUrls: string[]) {
    for (let api of apiUrls) {
        const response = await fetch(`${api}/cosmos/base/tendermint/v1beta1/blocks/latest`).catch(err => {
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

export async function getBlockByHeight(apiUrls: string[], blockHeight: number) {
    for (let api of apiUrls) {
        const response = await fetch(`${api}/cosmos/base/tendermint/v1beta1/blocks/${blockHeight}`);
        if (!response.ok) {
            console.warn(`Failed to retrieve block height for ${blockHeight} from ${api}`);
            continue;
        }

        return (await response.json()) as BlockResponse;
    }

    throw new Error(`Failed to fetch block height ${blockHeight}, all API urls have failed`);
}

export async function getMemoFromTx(config: Config, txHash: string) {
    for (let api of config.API_URLS) {
        const txResponse = await fetch(`${api}/cosmos/tx/v1beta1/txs/${txHash.toUpperCase()}`);

        if (!txResponse.ok) {
            continue;
        }

        const txData = (await txResponse.json()) as TransactionResponse;
        if (config.MEMO_PREFIX && !decodeUnicode(txData.tx.body.memo).startsWith(config.MEMO_PREFIX)) {
            return null;
        }

        if (txData.tx_response.code !== 0) {
            return null;
        }

        for (let message of txData.tx.body.messages) {
            if (message['@type'] !== '/cosmos.bank.v1beta1.MsgSend') {
                continue;
            }

            if (config.SENDER && message.from_address !== config.SENDER) {
                continue;
            }

            if (config.RECEIVER && message.to_address !== config.RECEIVER) {
                continue;
            }

            return {
                hash: txHash,
                from: message.from_address,
                to: message.to_address,
                memo: decodeUnicode(txData.tx.body.memo),
                amounts: message.amount,
            };
        }

        return null;
    }

    throw new Error(`Failed to fetch transaction ${txHash}, all API urls have failed`);
}
