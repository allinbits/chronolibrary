import { assert, test, describe, it } from 'vitest';
import { ChronoState } from '../src';
import { getCurrentBlockHeight } from '../src/requests';

const APIS = [
    'https://atomone-api.allinbits.com',
    `https://atomone-rest.publicnode.com`,
]

test('test callbacks', async () => {
    const state = new ChronoState({
        API_URLS: [],
        START_BLOCK: String(1_000_000),
        LOG: true,
    });

    let didCallAction = false;
    let didCallLastBlock = false;

    state.onAction((_action) => {
        didCallAction = true;
    });

    state.onLastBlock((_lastBlock) => {
        didCallLastBlock = true;
    });

    state.emitCallbacks({ hash: '', height: '', memo: '', timestamp: '', messages: [] });
    state.emitLastBlockCallbacks();

    assert(didCallAction, 'Did not emit callbacks');
    assert(didCallLastBlock, 'Did not emit last block callbacks');
});

describe('chronostate', async () => {
    const max_block_batch_count = 5;

    it('process at least 5 blocks', async (test) => {
        const height = await getCurrentBlockHeight(APIS);
        let lastBlock = `${parseInt(height) - 100}`

        const chronoState = new ChronoState({ API_URLS: APIS, START_BLOCK: lastBlock, BATCH_SIZE: 5, LOG: true });
        let blockBatchCount = 0;

        chronoState.onLastBlock((block) => {
            const diff = parseInt(block) - parseInt(lastBlock);
            assert.isOk(diff === 5);
            lastBlock = block;
            blockBatchCount += 1;
        });

        chronoState.start();

        await new Promise((resolve: Function) => {
            const interval = setInterval(() => {
                if (blockBatchCount < max_block_batch_count) {
                    return;
                }

                clearInterval(interval);
                resolve();
            }, 500);
        });
    });
}, { timeout: 60_000 })