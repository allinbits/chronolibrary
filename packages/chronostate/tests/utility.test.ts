import { describe, it, expect, assert } from 'vitest';
import { base64ToArrayBuffer, toHex, sha256, decodeUnicode, findValidMemo } from '../src/utility/index';
import { GOOD_CONFIG, txResponse } from './data';

describe('base64ToArrayBuffer', () => {
    it('should convert base64 to Uint8Array', () => {
        const base64 = 'SGVsbG8='; // "Hello" in base64
        const expected = new Uint8Array([72, 101, 108, 108, 111]);
        expect(base64ToArrayBuffer(base64)).toEqual(expected);
    });

    it('should throw an error for invalid base64 input', () => {
        const invalidBase64 = 'SGVsbG8=='; // Invalid padding
        expect(() => base64ToArrayBuffer(invalidBase64)).toThrowError();
    });
});

describe('toHex', () => {
    it('should convert Uint8Array to hex string', () => {
        const input = new Uint8Array([255, 0, 128]);
        expect(toHex(input)).toBe('ff0080');
    });
});

describe('sha256', () => {
    it('should hash data using SHA-256', () => {
        const input = new Uint8Array(new TextEncoder().encode('hello'));
        const hash = sha256(input);
        expect(toHex(hash)).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
    });
});

describe('decodeUnicode', () => {
    it('should decode Unicode escape sequences', () => {
        const input = 'Hello, \\u0024';
        expect(decodeUnicode(input)).toBe('Hello, $');
    });

    it('should decode a string with a mix of all three unicode formats', () => {
        const input = 'Hello \\u0048\\u0065\\u006C\\u006C\\u006F \\U00000021 from \\x4A\\x61\\x76\\x61\\x53\\x63\\x72\\x69\\x70\\x74.';
        const expected = 'Hello Hello ! from JavaScript.';
        expect(decodeUnicode(input)).toBe(expected);
    });
});

describe('findValidMemo', () => {
    it('should find a valid memo', () => {
        const memo = findValidMemo({ txData: txResponse, config: GOOD_CONFIG, prefixes: [] });
        expect(memo).toBeTruthy();

        if (!memo) {
            assert.fail(`Failed to extract memo`);
        }

        const idx = memo?.messages.findIndex(x => x['@type'] === '/cosmos.bank.v1beta1.MsgSend');
        expect(typeof idx).toBe('number');
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(memo.messages[idx].from_address).toBe('atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250')
        expect(memo.messages[idx].to_address).toBe('atone1h36dsx4pflgjmesct389faxpqtxczj3lqjmu9s')
        expect(memo.memo).toBe('')
    });

    it('should find a valid memo based on from address', () => {
        const memo = findValidMemo({ txData: txResponse, prefixes: [], 
            config: {
                ...GOOD_CONFIG,
                SENDER: 'atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250'
            }
        });

        expect(memo).toBeTruthy();
    })

    it('should find a valid memo based on to address', () => {
        const memo = findValidMemo({ txData: txResponse, prefixes: [], config: {
                ...GOOD_CONFIG,
                RECEIVER: 'atone1h36dsx4pflgjmesct389faxpqtxczj3lqjmu9s',
            }
        });

        expect(memo).toBeTruthy();
    })
})
