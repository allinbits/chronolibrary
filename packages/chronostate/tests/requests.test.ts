import { describe, it, expect, assert } from 'vitest';
import { getBlockByHeight, getCurrentBlockHeight } from '../src/requests';

const APIS = [
    'https://atomone-api.allinbits.com',
    `https://atomone-rest.publicnode.com`,
]

describe('getCurrentBlockHeight', () => {
    it('should return the current block height from the first successful API', async () => {
        try {
            const height = await getCurrentBlockHeight(APIS);
            assert(parseInt(height) >= 1);
        } catch (err) {
            console.error(err);
            assert.fail('Failed to fetch block height')
        }
    });

    it('should try multiple APIs and return the first successful block height', async () => {
        try {
            const height = await getCurrentBlockHeight([
                'https://fake-api.allinbits.com',
                ...APIS,
            ]);
            assert(parseInt(height) >= 1);
        } catch (err) {
            console.error(err);
            assert.fail('Failed to fetch block height')
        }
    });

    it('should throw an error if all APIs fail', async () => {
        await expect(getCurrentBlockHeight(['https://bad.api'])).rejects.toThrow(
            'Failed to fetch current block height, all API urls have failed'
        );
    });
});

describe('getBlockByHeight', () => {
    it('it should fetch latest data from latest block', async () => {
        const height = await getCurrentBlockHeight(APIS);
        assert(parseInt(height) >= 1);
        const response = await getBlockByHeight(APIS, parseInt(height));
        assert.isOk(response, 'response was not okay');
    });

    it('should throw an error if all APIs fail', async () => {
        await expect(getBlockByHeight(['https://bad.api'], -1)).rejects.toThrow(
            'Failed to fetch block height -1, all API urls have failed. Retry 3'
        );
    });
});