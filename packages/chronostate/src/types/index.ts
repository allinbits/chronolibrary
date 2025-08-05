import { Message } from "./transaction";

export interface Config {
    API_URLS: Array<string>;
    MEMO_PREFIX?: string;
    RECEIVER?: string;
    START_BLOCK: string;
    SENDER?: string;
    LOG?: boolean;
    BATCH_SIZE?: number;
}

export interface Action {
    hash: string;
    height: string;
    timestamp: string;
    memo: string;
    messages: Array<Message>;
}
