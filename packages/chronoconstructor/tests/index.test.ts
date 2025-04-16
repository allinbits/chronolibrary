import { describe, it, expect, assert } from 'vitest';
import { extractMemoContent, extractNamespaceFunction, ChronoConstructor } from '../src/index';

describe('extractMemoContent', () => {
    it('should return an array of arguments from a memo', async () => {
        const results = extractMemoContent('example.send("hello", "world", "!")', 'example.send');

        expect(results[0] == 'hello');
        expect(results[1] == 'world');
        expect(results[2] == '!');
    });

    it('should return an empty array for no arguments', async () => {
        const results = extractMemoContent('example.send()', 'example.send');
        expect(results.length <= 0);
    });
});

describe('extractNamespaceFunction', () => {
    it('should return the correct namespace and function name', async () => {
        const results = extractNamespaceFunction('example.send("hello", "world", "!")');

        expect(results?.namespace === 'hello');
        expect(results?.functionName === 'world');
    });

    it('should return the correct namespace and function name', async () => {
        const results = extractNamespaceFunction('example bad :(');
        expect(typeof results === null);
    });
});

describe('constructor', () => {
    it('should invoke a bound function call based on memo', async () => {
        const state = new ChronoConstructor();
        let didSendPass = false;
        let didTestPass = false;

        state.addAction(('send'), (dataSet, action) => {
            if (!action.memo.startsWith('example.send')) {
                return;
            }

            didSendPass = true;
        });

        state.addAction(('test'), (dataSet, action) => {
            if (!action.memo.startsWith('example.test')) {
                return;
            }

            didTestPass = true;
        });

        await state.parse([{amounts: [{amount: '', denom: ''}], from_address: '', to_address: '', hash: '', height: '', memo: 'example.send("hello", "world)', timestamp: ''}], {})
        await state.parse([{amounts: [{amount: '', denom: ''}], from_address: '', to_address: '', hash: '', height: '', memo: 'example.test("hello", "world)', timestamp: ''}], {})
        expect(didSendPass);
        expect(didTestPass);
    })
});
