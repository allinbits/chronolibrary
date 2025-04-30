import { describe, it, expect, assert } from 'vitest';
import { getCurrentBlockHeight } from '../src/requests';

describe('getCurrentBlockHeight', () => {
    it('should return the current block height from the first successful API', async () => {
        try {
            const height = await getCurrentBlockHeight([
                'https://atomone-api.allinbits.com',
                `https://atomone-rest.publicnode.com`,
            ]);
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
                'https://atomone-api.allinbits.com',
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
