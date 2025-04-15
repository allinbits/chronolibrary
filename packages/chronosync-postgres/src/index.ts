import { ChronoState } from '@atomone/chronostate';
import { Action } from '@atomone/chronostate/dist/types';

import { initDatabase, useDatabase } from './database';
import { useConfig } from './config';

const config = useConfig();
const db = useDatabase();

let state: ChronoState;
let lastBlock: string;
let lastAction: Action;

async function handleAction(action: Action) {
    if (lastAction && lastAction.hash === action.hash) {
        return;
    }

    await db.action.insert(action);
    lastAction = action;
}

function handleLastBlock(block: string | String) {
    db.lastBlock.update(block as string);
    console.log(`Updated Block | ${block}`);
}

export async function start() {
    await initDatabase();

    lastBlock = await db.lastBlock.select();
    state = new ChronoState({ ...config, START_BLOCK: lastBlock });
    state.onLastBlock(handleLastBlock);
    state.onAction(handleAction);
    state.start();
}

start();