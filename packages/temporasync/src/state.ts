import { TemporaState } from '@atomone/temporastate';
import { Action } from '@atomone/temporastate/dist/types';

import { useDatabase } from './database';
import { useConfig } from './config';

const db = useDatabase();
const config = useConfig();
const lastBlock = db.lastBlock.select.get(1) as { id: number; block_value: string };
const temporaState = new TemporaState({ ...config, START_BLOCK: lastBlock.block_value });

let lastAction: Action | undefined;

function handleAction(action: Action) {
    const row = db.action.select.get(action.hash);
    if (row) {
        return;
    }

    try {
        db.action.insert.run(
            action.hash,
            action.height,
            action.timestamp,
            action.from,
            action.to,
            action.memo,
            JSON.stringify(action.amounts)
        );
    } catch (err) {
        console.error(err);
        console.log(`Skipped ${action.hash}, data already exists.`);
    }

    lastAction = action;
}

function handleLastBlock(block: String) {
    db.lastBlock.update.run(block as string, 1);
    console.log(`Last Block Updated: ${block}`);
}

temporaState.onLastBlock(handleLastBlock);
temporaState.onAction(handleAction);
temporaState.start();

console.log('[TemporaSync] TemporaSync Started');
