import { describe, it, expect } from 'vitest';
import { base64ToArrayBuffer, toHex, sha256, decodeUnicode } from '../src/utility/index';

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
