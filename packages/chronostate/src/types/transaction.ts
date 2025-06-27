export interface TransactionResponse {
    tx: Tx;
    tx_response: TxResponse;
}

export interface Tx {
    body: Body;
    auth_info: AuthInfo;
    signatures: string[];
}

export interface Body {
    messages: Message2[];
    memo: string;
    timeout_height: string;
    extension_options: any[];
    non_critical_extension_options: any[];
}

export interface Amount {
    denom: string;
    amount: string;
}

export interface AuthInfo {
    signer_infos: SignerInfo[];
    fee: Fee;
    tip: any;
}

export interface SignerInfo {
    public_key: PublicKey;
    mode_info: ModeInfo;
    sequence: string;
}

export interface PublicKey {
    '@type': string;
    key: string;
}

export interface ModeInfo {
    single: Single;
}

export interface Single {
    mode: string;
}

export interface Fee {
    amount: Amount2[];
    gas_limit: string;
    payer: string;
    granter: string;
}

export interface Amount2 {
    denom: string;
    amount: string;
}

export interface TxResponse {
    height: string;
    txhash: string;
    codespace: string;
    code: number;
    data: string;
    raw_log: string;
    logs: any[];
    info: string;
    gas_wanted: string;
    gas_used: string;
    tx: Tx2;
    timestamp: string;
    events: Event[];
}

export interface Tx2 {
    '@type': string;
    body: Body2;
    auth_info: AuthInfo2;
    signatures: string[];
}

export interface Body2 {
    messages: Message2[];
    memo: string;
    timeout_height: string;
    extension_options: any[];
    non_critical_extension_options: any[];
}

export interface Message2 {
    '@type': string;
    from_address: string;
    to_address: string;
    amount: Amount3[];
    msgs: Message2[];
}

export interface Amount3 {
    denom: string;
    amount: string;
}

export interface AuthInfo2 {
    signer_infos: SignerInfo2[];
    fee: Fee2;
    tip: any;
}

export interface SignerInfo2 {
    public_key: PublicKey2;
    mode_info: ModeInfo2;
    sequence: string;
}

export interface PublicKey2 {
    '@type': string;
    key: string;
}

export interface ModeInfo2 {
    single: Single2;
}

export interface Single2 {
    mode: string;
}

export interface Fee2 {
    amount: Amount4[];
    gas_limit: string;
    payer: string;
    granter: string;
}

export interface Amount4 {
    denom: string;
    amount: string;
}

export interface Event {
    type: string;
    attributes: Attribute[];
}

export interface Attribute {
    key: string;
    value: string;
    index: boolean;
}
