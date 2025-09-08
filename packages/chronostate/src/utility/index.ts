import { createHash } from 'crypto';
import { Message, TransactionResponse } from '../types/transaction';
import { Config } from '../types';

const base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

export namespace MemoExtractor {
  export interface TypeMap {}
}

export function generateConfigDefaults(config: Config) {
    if (!config.BLOCKS_PATH) {
        config.BLOCKS_PATH = '/cosmos/base/tendermint/v1beta1/blocks';
    }

    if (!config.TRANSACTION_PATH) {
        config.TRANSACTION_PATH = '/cosmos/tx/v1beta1/txs';
    }

    if (!config.COSMOS_BANK_SEND_MSG_TYPE) {
        config.COSMOS_BANK_SEND_MSG_TYPE = '/cosmos.bank.v1beta1.MsgSend';
    }

    if (!config.COSMOS_EXEC_MSG_TYPE) {
        config.COSMOS_EXEC_MSG_TYPE = '/cosmos.authz.v1beta1.MsgExec';
    }

    return config;
}

export function base64ToArrayBuffer(base64: string) {
    if (!base64Regex.test(base64)) {
        throw new Error('Invalid base64 string provided');
    }

    try {
        const binary_string = Buffer.from(base64, 'base64').toString('binary');
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
    
        return bytes;
    } catch(e) {
        console.error("Invalid base64 string provided");
        throw e;
    }
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
 * Arguments are extracted as long as they are surrounded by `double quotes`.
 * 
 * Example: `"blah", "blah", "blah"`
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

        result.push(currentItem);

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

/**
 * Gets valid memo data based on the message type.
 * 
 * Authz exec is handled for only the first nested level of messages.
 * 
 * Meaning, if a bank message can be found in the messages array it will count as a valid memo.
 *
 * @export
 * @param {{
 *     config: Config;
 *     prefixes: string[];
 *     txData: TransactionResponse;
 * }} data
 * @return {*} 
 */
export function findValidMemo(data: {
    config: Config;
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

    const isExec = data.txData.tx.body.messages[0]['@type'] === data.config.COSMOS_EXEC_MSG_TYPE;
    const messages: Message[] = isExec ?  data.txData.tx.body.messages[0].msgs : data.txData.tx.body.messages;

    // Return normal unmatched message because no sender or receiver specified
    if (!data.config.SENDER && !data.config.RECEIVER) {
        return {
            memo: decodeUnicode(data.txData.tx.body.memo),
            messages: messages,
        };
    }

    const isMatching = (option: 'from_address' | 'to_address', address: string) => {
        const result = messages.find(x => {
            if (x['@type'] !== data.config.COSMOS_BANK_SEND_MSG_TYPE) {
                return false;
            }

            return x[option] == address
        });

        return !!result;
    }

    let isSenderMatching = isMatching('from_address', data.config.SENDER ?? '');
    let isReceiverMatching = isMatching('to_address', data.config.RECEIVER ?? '');;

    // Both send and receiver match specified config
    if (data.config.RECEIVER && data.config.SENDER) {
        if (isSenderMatching && isReceiverMatching) {
            return {
                memo: decodeUnicode(data.txData.tx.body.memo),
                messages: messages,
            };
        }

        return null;
    }

    // Handle is receiver is matching, or sender is matching
    if ((data.config.RECEIVER && isReceiverMatching) || (data.config.SENDER && isSenderMatching) ) {
        return {
            memo: decodeUnicode(data.txData.tx.body.memo),
            messages: messages,
        };
    }
    
    return null;
}
