type PublicAddress = string;

export interface Config {
    API_URLS: Array<string>;
    MEMO_PREFIX?: string | undefined;
    RECEIVER?: string | undefined;
    START_BLOCK: string;
    SENDER?: string | undefined;
    LOG?: boolean | undefined;
    BATCH_SIZE?: number;
}

export interface Forum {
    owner: PublicAddress;
    admins: Array<PublicAddress>;
    threads: Array<Thread>;
    lastBlock: string;
}

export interface Thread {
    updated: string;
    hash: string;
    title: string;
    messages: Array<Message>;
}

export interface Message {
    timestamp: string;
    hash: string;
    message: string;
    author: string;
    upvotes: Array<string>;
}

export interface Action {
    hash: string;
    height: string;
    timestamp: string;
    from: string;
    to: string;
    memo: string;
    amounts: Array<{
        denom: string;
        amount: string;
    }>;
}
