export interface BlockResponse {
    block_id: BlockId;
    block: Block;
    sdk_block: SdkBlock;
}

export interface BlockId {
    hash: string;
    part_set_header: PartSetHeader;
}

export interface PartSetHeader {
    total: number;
    hash: string;
}

export interface Block {
    header: Header;
    data: Data;
    evidence: Evidence;
    last_commit: LastCommit;
}

export interface Header {
    version: Version;
    chain_id: string;
    height: string;
    time: string;
    last_block_id: LastBlockId;
    last_commit_hash: string;
    data_hash: string;
    validators_hash: string;
    next_validators_hash: string;
    consensus_hash: string;
    app_hash: string;
    last_results_hash: string;
    evidence_hash: string;
    proposer_address: string;
}

export interface Version {
    block: string;
    app: string;
}

export interface LastBlockId {
    hash: string;
    part_set_header: PartSetHeader2;
}

export interface PartSetHeader2 {
    total: number;
    hash: string;
}

export interface Data {
    txs: any[];
}

export interface Evidence {
    evidence: any[];
}

export interface LastCommit {
    height: string;
    round: number;
    block_id: BlockId2;
    signatures: Signature[];
}

export interface BlockId2 {
    hash: string;
    part_set_header: PartSetHeader3;
}

export interface PartSetHeader3 {
    total: number;
    hash: string;
}

export interface Signature {
    block_id_flag: string;
    validator_address: string;
    timestamp: string;
    signature: string;
}

export interface SdkBlock {
    header: Header2;
    data: Data2;
    evidence: Evidence2;
    last_commit: LastCommit2;
}

export interface Header2 {
    version: Version2;
    chain_id: string;
    height: string;
    time: string;
    last_block_id: LastBlockId2;
    last_commit_hash: string;
    data_hash: string;
    validators_hash: string;
    next_validators_hash: string;
    consensus_hash: string;
    app_hash: string;
    last_results_hash: string;
    evidence_hash: string;
    proposer_address: string;
}

export interface Version2 {
    block: string;
    app: string;
}

export interface LastBlockId2 {
    hash: string;
    part_set_header: PartSetHeader4;
}

export interface PartSetHeader4 {
    total: number;
    hash: string;
}

export interface Data2 {
    txs: any[];
}

export interface Evidence2 {
    evidence: any[];
}

export interface LastCommit2 {
    height: string;
    round: number;
    block_id: BlockId3;
    signatures: Signature2[];
}

export interface BlockId3 {
    hash: string;
    part_set_header: PartSetHeader5;
}

export interface PartSetHeader5 {
    total: number;
    hash: string;
}

export interface Signature2 {
    block_id_flag: string;
    validator_address: string;
    timestamp: string;
    signature: string;
}
