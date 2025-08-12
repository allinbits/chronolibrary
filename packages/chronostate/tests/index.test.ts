import { assert, test, describe, it } from 'vitest';
import { ChronoState } from '../src';
import { getCurrentBlockHeight } from '../src/requests';
import { GOOD_CONFIG } from './data';

test('test callbacks', async () => {
    const state = new ChronoState({
        API_URLS: [],
        START_BLOCK: String(1_000_000),
        LOG: true,
    });

    let didCallAction = false;
    let didCallLastBlock = false;

    const action1 = state.onAction((_action) => {
        didCallAction = true;
    });

    const action2 = state.onLastBlock((_lastBlock) => {
        didCallLastBlock = true;
    });

    state.emitCallbacks({ hash: '', height: '', memo: '', timestamp: '', messages: [] });
    state.emitLastBlockCallbacks();

    assert(didCallAction, 'Did not emit callbacks');
    assert(didCallLastBlock, 'Did not emit last block callbacks');

    assert.equal(action1, 0);
    assert.equal(action2, 1);

    state.offAction(action1);
    state.offLastBlock(action2);
});

describe('chronostate', async () => {
    const max_block_batch_count = 5;

    it('process at least 5 blocks', async (test) => {
        const height = await getCurrentBlockHeight(GOOD_CONFIG);
        let lastBlock = `${parseInt(height) - 100}`

        const chronoState = new ChronoState({ API_URLS: GOOD_CONFIG.API_URLS, START_BLOCK: lastBlock, BATCH_SIZE: 5, LOG: true });
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