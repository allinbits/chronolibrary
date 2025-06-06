import { ChronoState } from '@atomone/chronostate';
import { Action } from '@atomone/chronostate/dist/types';

import { useDatabase } from './database';
import { useConfig } from './config';

const db = useDatabase();
const config = useConfig();
const lastBlock = db.lastBlock.select.get(1) as { id: number; block_value: string };
const state = new ChronoState({ ...config, START_BLOCK: lastBlock.block_value });

let lastAction: Action | undefined;

function handleAction(action: Action) {
    try {
        //hash, height, timestamp, memo, messages

        db.action.insert.run(
            action.hash,
            action.height,
            action.timestamp,
            action.memo,
            JSON.stringify(action.messages)
        );
    } catch (err) {
        console.error(err);
        console.log(`Skipped ${action.hash}, data already exists.`);
    }

    lastAction = action;
}

function handleLastBlock(block: String) {
    db.lastBlock.update.run(block as string, 1);
    console.log(`Updated Block | ${block}`);
}

state.onLastBlock(handleLastBlock);
state.onAction(handleAction);
state.start();
