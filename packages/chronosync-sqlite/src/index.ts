import { ChronoState } from '@atomone/chronostate';
import { Action } from '@atomone/chronostate/dist/types';

import { useDatabase } from './database';
import { useConfig } from './config';

const db = useDatabase();
const config = useConfig();
const lastBlock = db.lastBlock.select.get() as { id: number; block_value: string };
const state = new ChronoState({ ...config, START_BLOCK: lastBlock.block_value });

function handleAction(action: Action) {
    let messages: string | undefined;
    
    try {
        messages = JSON.stringify(action.messages);
    } catch(err) {
        console.error(err)
    }

    if (typeof messages === 'undefined') {
        console.warn(`Failed to parse messages to JSON for action ${action.hash}`)
        return;
    }

    try {
        //hash, height, timestamp, memo, messages
        db.action.insert.run(
            action.hash,
            action.height,
            action.timestamp,
            action.memo,
            messages
        );
    } catch (err) {
        console.error(err);
        console.log(`Skipped ${action.hash}, data already exists.`);
    }
}

function handleLastBlock(block: string) {
    db.lastBlock.update.run(block);
    console.log(`Updated Block | ${block}`);
}

state.onLastBlock(handleLastBlock);
state.onAction(handleAction);
state.start();
