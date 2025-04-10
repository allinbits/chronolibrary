import * as Requests from './requests/index';
import { Action, Config } from './types';
import { BlockResponse } from './types/block';
import { base64ToArrayBuffer, sha256, toHex } from './utility';

export * from './utility/index';
export * from './types/index'

export class ChronoState {
    isParsing = false;
    isStopped = false;
    private config: Config;
    private callbacks: Array<{ id: number; cb: (action: Action) => void }> = [];
    private callbacksOffBlock: Array<{ id: number; cb: (block: String) => void }> = [];
    private incremental = 1;
    private batchSize = 10;
    private lastBlock = '';
    private maxBlock: number = -1;
    private prefixes: string[] = [];

    constructor(config: Config) {
        this.config = config;
        if (this.config.MEMO_PREFIX) {
            this.prefixes = this.config.MEMO_PREFIX.split(',');
        } else {
            this.prefixes = [];
        }

        this.lastBlock = config.START_BLOCK;
        if (this.config.BATCH_SIZE) {
            this.batchSize = this.config.BATCH_SIZE;
        }
    }

    setBlockMin(value: string) {
        this.config.START_BLOCK = value;
        return this;
    }

    setApis(values: string[]) {
        this.config.API_URLS = values;
        return this;
    }

    onAction(callback: (action: Action) => void) {
        this.incremental++;
        this.callbacks.push({ id: this.incremental, cb: callback });
        return this.incremental;
    }

    offAction(id: number) {
        const idx = this.callbacks.findIndex((x) => x.id === id);
        this.callbacks.splice(idx, 1);
    }

    onLastBlock(callback: (block: String | string) => void) {
        this.incremental++;
        this.callbacksOffBlock.push({ id: this.incremental, cb: callback });
        return this.incremental;
    }

    offLastBlock(id: number) {
        const idx = this.callbacksOffBlock.findIndex((x) => x.id === id);
        this.callbacksOffBlock.splice(idx, 1);
    }

    async start(endBlock: string | null = null) {
        if (this.isParsing) {
            throw new Error('ChronoState is already parsing blocks.');
        }

        this.isParsing = true;

        while (this.isParsing) {
            // If no endblock, use max block and keep processing
            if (!endBlock) {
                await this.updateMaxBlock();
                if (parseInt(this.lastBlock) >= this.maxBlock) {
                    if (this.config.LOG) {
                        console.log(`Max block reached, waiting for new blocks`);
                    }
    
                    await new Promise((resolve: Function) => {
                        setTimeout(resolve, 5000);
                    });
    
                    continue;
                }
            } else {
                this.maxBlock = parseInt(endBlock);

                if (parseInt(this.lastBlock) >= this.maxBlock) {
                    if (this.config.LOG) {
                        console.log(`Max block reached, breaking out`);
                    }

                    this.isParsing = false;
                    break;
                }
            }

            for (let i = parseInt(this.lastBlock); i <= this.maxBlock; i += this.batchSize) {
                const batchEnd = Math.min(i + this.batchSize - 1, this.maxBlock);

                if (!this.isParsing) {
                    break;
                }

                if (i > batchEnd) {
                    break;
                }

                const blocks = await this.fetchBatchWithRetry(i, batchEnd);
                const hexTxHashes: { hash: string; timestamp: string; height: string }[] = [];
                for (let blockData of blocks) {
                    const height = blockData.block.header.height;
                    const txHashes = blockData.block.data.txs;
                    const timestamp = blockData.block.header.time;
    
                    for (let encodedTxHash of txHashes) {
                        hexTxHashes.push({ hash: toHex(sha256(base64ToArrayBuffer(encodedTxHash))), timestamp, height });
                    }
                }
    
                for (let txData of hexTxHashes) {
                    const result = await this.fetchMemoWithRetry(txData.hash);
                    if (!result) {
                        continue;
                    }
    
                    this.emitCallbacks({
                        ...result,
                        timestamp: txData.timestamp,
                        height: txData.height,
                        hash: txData.hash,
                    });
                }
    
                this.lastBlock = `${batchEnd}`;
                this.emitLastBlockCallbacks();
            }
        }

        this.isStopped = true;
    }

    async stop() {
        this.isParsing = false;
    }

    private async updateMaxBlock() {
        try {
            const response = await Requests.getCurrentBlockHeight(this.config.API_URLS);
            this.maxBlock = parseInt(response);
        } catch (err) {
            console.warn(`Failed to fetch head block for chain.`);
        }
    }

    private emitCallbacks(action: Action) {
        for (let callbackData of this.callbacks) {
            callbackData.cb(action);
        }
    }

    private emitLastBlockCallbacks() {
        for (let callbackData of this.callbacksOffBlock) {
            callbackData.cb(this.lastBlock);
        }
    }

    private async fetchBatchWithRetry(start: number, end: number): Promise<BlockResponse[]> {
        while (true) {
            try {
                if (this.config.LOG) {
                    console.log(`Fetching blocks ${start} to ${end}`);
                }

                const blockPromises: Promise<BlockResponse>[] = [];
                for (let j = start; j <= end; j++) {
                    blockPromises.push(Requests.getBlockByHeight(this.config.API_URLS, j));
                }

                const blocks = await Promise.all(blockPromises);
                blocks.sort((a, b) => parseInt(a.block.header.height) - parseInt(b.block.header.height));

                if (this.config.LOG) {
                    console.log(`Successfully fetched blocks ${start} to ${end}`);
                }

                return blocks;
            } catch (error) {
                console.warn(`Batch fetch failed for blocks ${start} to ${end}, retrying...`, error);
                await new Promise((resolve: Function) => {
                    setTimeout(resolve, 2000);
                });
            }
        }
    }

    private async fetchMemoWithRetry(txHash: string) {
        while (true) {
            try {
                if (this.config.LOG) {
                    console.log(`Fetching memo for tx: ${txHash}`);
                }

                const result = await Requests.getMemoFromTx(this.config, this.prefixes, txHash);
                if (!result) {
                    return null;
                }

                if (this.config.LOG) {
                    console.log(`Successfully fetched memo for tx: ${txHash}`);
                }

                return result;
            } catch (error) {
                console.warn(`Failed to fetch memo for tx: ${txHash}, retrying...`, error);
                await new Promise((resolve: Function) => {
                    setTimeout(resolve, 2000);
                });
            }
        }
    }
}
