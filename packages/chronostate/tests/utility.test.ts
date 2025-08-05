import { describe, it, expect } from 'vitest';
import { base64ToArrayBuffer, toHex, sha256, decodeUnicode, findValidMemo } from '../src/utility/index';
import { txResponse } from './data';

describe('base64ToArrayBuffer', () => {
    it('should convert base64 to Uint8Array', () => {
        const base64 = 'SGVsbG8='; // "Hello" in base64
        const expected = new Uint8Array([72, 101, 108, 108, 111]);
        expect(base64ToArrayBuffer(base64)).toEqual(expected);
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
});

describe('findValidMemo', () => {
    it('should find a valid memo', () => {
        const memo = findValidMemo({ txData: txResponse, prefixes: [] });
        expect(memo);

        const idx = memo?.messages.findIndex(x => x['@type'] === '/cosmos.bank.v1beta1.MsgSend');
        expect(typeof idx === 'number' && idx >= 0, 'expected to find at least one valid message')
        expect(memo && typeof idx === 'number' && memo.messages[idx].from_address == 'atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250')
        expect(memo && typeof idx === 'number' && memo.messages[idx].to_address == 'atone1h36dsx4pflgjmesct389faxpqtxczj3lqjmu9s')
        expect(memo?.memo == '');
    });

    it('should find a valid memo based on from address', () => {
        const memo = findValidMemo({ txData: txResponse, prefixes: [], sender: 'atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250' });
        expect(memo);
    })

    it('should find a valid memo based on to address', () => {
        const memo = findValidMemo({ txData: txResponse, prefixes: [], receiver: 'atone1h36dsx4pflgjmesct389faxpqtxczj3lqjmu9s' });
        expect(memo);
    })
})
