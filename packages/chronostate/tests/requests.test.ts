import { describe, it, expect, assert } from 'vitest';
import { getBlockByHeight, getCurrentBlockHeight } from '../src/requests';
import { BAD_CONFIG, GOOD_CONFIG, MIXED_CONFIG } from './data';

describe('getCurrentBlockHeight', () => {
    it('should return the current block height from the first successful API', async () => {
        const height = await getCurrentBlockHeight(GOOD_CONFIG);
        if (!height) {
            assert.fail('Failed to fetch block height');
        }

        assert(parseInt(height) >= 1);
    });

    it('should try multiple APIs and return the first successful block height', async () => {
        const height = await getCurrentBlockHeight(MIXED_CONFIG);
        if (!height) {
            assert.fail('Failed to fetch block height');
        }

        assert(parseInt(height) >= 1);
    });

    it('should throw an error if all APIs fail', async () => {
        await expect(getCurrentBlockHeight(BAD_CONFIG)).rejects.toThrow();
    });
}, { timeout: 20_000 });

describe('getBlockByHeight', () => {
    it('it should fetch latest data from latest block', async () => {
        const height = await getCurrentBlockHeight(GOOD_CONFIG);
        if (!height) {
            assert.fail('Failed to fetch block height');
        }

        assert(parseInt(height) >= 1);
        const response = await getBlockByHeight(GOOD_CONFIG, parseInt(height));
        assert.isOk(response, 'response was not okay');
    });

    it('should throw an error if all APIs fail', async () => {
        await expect(getBlockByHeight(BAD_CONFIG, -1)).rejects.toThrow();
    });
}, { timeout: 20_000 });