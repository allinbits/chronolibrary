import { ChronoState } from '@atomone/chronostate';
import { useConfig } from './config';
import { initDatabase, useDatabase } from './database';
import { Action } from '@atomone/chronostate/dist/types';

const config = useConfig();
const db = useDatabase();

let state: ChronoState;
let lastBlock: string | null;
let lastAction: Action;

async function handleAction(action: Action) {
    if (lastAction && lastAction.hash === action.hash) {
        return;
    }

    const result = await db.action.findOne(action.hash);
    if (result) {
        return;
    }

    try {
        await db.action.insert(action);
    } catch (err) {
        console.error(err);
    }

    lastAction = action;
}

function handleLastBlock(block: string | String) {
    db.lastBlock.update(block as string);
    console.log(`Updated Block | ${block}`);
}

export async function start() {
    await initDatabase();

    lastBlock = await db.lastBlock.select();
    if (!lastBlock) {
        state = new ChronoState({ ...config  });
    } else {
        state = new ChronoState({ ...config, START_BLOCK: String(parseInt(lastBlock) + 1) });
    }

    state.onLastBlock(handleLastBlock);
    state.onAction(handleAction);
    state.start();
}

start();
