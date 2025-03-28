import { assert, test } from 'vitest';
import { getCurrentBlockHeight } from '../src/requests';
import { TemporaState } from '../src';
import { Action } from '../src/types';

const endpoints = [`https://atomone-api.allinbits.com/`, `https://atomone-rest.publicnode.com`];

test(
    'test memo parsing for given block time frame',
    async () => {
        const height = await getCurrentBlockHeight(endpoints);
        const min_height = `${parseInt(height) - 10000}`;

        const temporaState = new TemporaState({
            API_URLS: endpoints,
            START_BLOCK: min_height,
            LOG: true,
        });

        const actions: Action[] = [];
        temporaState.onAction((action) => {
            actions.push(action);
            temporaState.stop();
        });

        await temporaState.start(height);
        assert(actions.length >= 1, 'Did not find any actions in the blocks');
    },
    { timeout: 60000 * 10 }
);
