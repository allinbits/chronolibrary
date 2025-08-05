import { createHash } from 'crypto';
import { Message, TransactionResponse } from '../types/transaction';

export namespace MemoExtractor {
  export interface TypeMap {}
}

export function base64ToArrayBuffer(base64: string) {
    const binary_string = atob ? atob(base64) : window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }

    return bytes;
}

export function toHex(data: Uint8Array): string {
    let out = '';
    for (const byte of data) {
        out += ('0' + byte.toString(16)).slice(-2);
    }
    return out;
}

export function sha256(uint8Array: Uint8Array) {
    return createHash('sha256').update(Buffer.from(uint8Array)).digest();
}

export function decodeUnicode(str: string) {
    return str.replace(/\\u([\dA-Fa-f]{4})/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

/**
 * Input should be the full memo. ie. `example.send("blah","blah","blah")`
 * commandPrefix should be the full command name. ie `example.Send`
 *
 * @export
 * @param {string} memo
 * @param {string} commandPrefix
 * @return {*}
 */
export function extractMemoContent<K extends keyof MemoExtractor.TypeMap>(memo: string, commandPrefix: K): MemoExtractor.TypeMap[K] {
    const start = `${commandPrefix}(`;
    const end = `)`;

    // Check if the memo starts with the command and ends with ')'
    if (memo.startsWith(start) && memo.endsWith(end)) {
        const content = memo.slice(start.length, -1);

        let inString = false;
        let currentItem = '';
        const result = [];

        for (let i = 0; i < content.length; i++) {
            const char = content[i];

            if (char === '"' && (i === 0 || content[i - 1] !== '\\')) {
                inString = !inString;
            }

            if (char === ',' && !inString) {
                result.push(currentItem);
                currentItem = '';
            } else {
                currentItem += char;
            }
        }

        if (currentItem.trim()) {
            result.push(currentItem);
        }

        return result.map((item) => {
            item = item.trim();
            if (item.startsWith('"') && item.endsWith('"')) {
                return item.slice(1, -1);
            }
            return item;
        }) as MemoExtractor.TypeMap[K];
    }

    return [] as MemoExtractor.TypeMap[K];
}

export function findValidMemo(data: {
    sender?: string;
    receiver?: string;
    prefixes: string[];
    txData: TransactionResponse;
}) {
    if (data.prefixes.length >= 1) {
        let foundPrefix = false;
        for (let prefix of data.prefixes) {
            if (!decodeUnicode(data.txData.tx.body.memo).startsWith(prefix)) {
                continue;
            }

            foundPrefix = true;
            break;
        }

        if (!foundPrefix) {
            return null;
        }
    }

    if (data.txData.tx_response.code !== 0) {
        return null;
    }

    const isExec = data.txData.tx.body.messages[0]['@type'] === '/cosmos.authz.v1beta1.MsgExec';
    const messages: Message[] = isExec ?  data.txData.tx.body.messages[0].msgs : data.txData.tx.body.messages;

    const isMatching = (option: 'from_address' | 'to_address', address: string) => {
        const result = messages.find(x => {
            if (x['@type'] !== '/cosmos.bank.v1beta1.MsgSend') {
                return false;
            }

            return x[option] == address
        });

        return !!result;
    }

    if (data.sender && isMatching('from_address', data.sender)) {
        return {
            memo: decodeUnicode(data.txData.tx.body.memo),
            messages: messages,
        }
    }

    if (data.receiver && isMatching('to_address', data.receiver)) {
        return {
            memo: decodeUnicode(data.txData.tx.body.memo),
            messages: messages,
        }
    }

    if (data.receiver || data.sender) {
        return null;
    }

    return {
        memo: decodeUnicode(data.txData.tx.body.memo),
        messages: messages,
    };
}
