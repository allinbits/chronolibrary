import { assert, test } from 'vitest';
import { ChronoState } from '../src';

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

    state.emitCallbacks({ amounts: [], from: '', to: '', hash: '', height: '', memo: '', timestamp: '' });
    state.emitLastBlockCallbacks();

    assert(didCallAction, 'Did not emit callbacks');
    assert(didCallLastBlock, 'Did not emit last block callbacks');
});
