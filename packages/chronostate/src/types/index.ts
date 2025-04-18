export interface Config {
    API_URLS: Array<string>;
    MEMO_PREFIX?: string | undefined;
    RECEIVER?: string | undefined;
    START_BLOCK: string;
    SENDER?: string | undefined;
    LOG?: boolean | undefined;
    BATCH_SIZE?: number;
}

export interface Action<T = { '@type': string; [key: string]: any }> {
    hash: string;
    height: string;
    timestamp: string;
    memo: string;
    messages: Array<T>;
}
