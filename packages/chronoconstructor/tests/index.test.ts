import { describe, it, expect } from 'vitest';
import { extractMemoContent, extractNamespaceFunction, ChronoConstructor } from '../src/index';

describe('extractMemoContent', () => {
    it('should return an array of arguments from a memo', async () => {
        const results = extractMemoContent('example.send("hello", "world", "!")', 'example.send');

        expect(results[0]).toBe('hello')
        expect(results[1]).toBe('world');
        expect(results[2]).toBe('!');
    });

    it('should return an empty array for no arguments', async () => {
        const results = extractMemoContent('example.send()', 'example.send');
        expect(results.length).toBeLessThanOrEqual(1);
        expect(results[0]).toBe('');
    });
});

describe('extractNamespaceFunction', () => {
    it('should return the correct namespace and function name', async () => {
        const results = extractNamespaceFunction('example.send("hello", "world", "!")');

        expect(results?.namespace).toBe('example');
        expect(results?.functionName).toBe('send');
    });

    it('should return the correct namespace and function name', async () => {
        const results = extractNamespaceFunction('example bad :(');
        expect(results).toBeNull();
    });
});

describe('constructor', () => {
    it('should invoke a bound function call based on memo', async () => {
        const state = new ChronoConstructor('example');
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

        await state.parse([ 
            { 
                hash: '', 
                height: '', 
                memo: 'example.send("hello", "world)', 
                timestamp: '',
                messages: [
                    {
                        "@type": "/cosmos.bank.v1beta1.MsgSend",
                        msgs: [],
                        amount: [{ amount: '', denom: ''}],
                        from_address: '', 
                        to_address: ''
                    }
                ]   
            }
        ], {});

        await state.parse([ 
            { 
                hash: '', 
                height: '', 
                memo: 'example.test("hello", "world)', 
                timestamp: '',
                messages: [
                    {
                        "@type": "/cosmos.bank.v1beta1.MsgSend",
                        msgs: [],
                        amount: [{ amount: '', denom: ''}],
                        from_address: '', 
                        to_address: ''
                    }
                ]   
            }
        ], {});

        expect(didSendPass).toEqual(true);
        expect(didTestPass).toEqual(true);
    })
});
