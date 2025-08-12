import { z } from 'zod';

// Base schemas for common structures
const TimestampSchema = z.string().datetime();
const HashSchema = z.string();
const HeightSchema = z.string();
const AddressSchema = z.string();

// Block Header Schema
const BlockHeaderSchema = z.object({
  version: z.object({
    block: z.string(),
    app: z.string().optional(),
  }),
  chain_id: z.string(),
  height: HeightSchema,
  time: TimestampSchema,
  last_block_id: z.object({
    hash: HashSchema,
    part_set_header: z.object({
      total: z.number(),
      hash: HashSchema,
    }),
  }),
  last_commit_hash: HashSchema,
  data_hash: HashSchema,
  validators_hash: HashSchema,
  next_validators_hash: HashSchema,
  consensus_hash: HashSchema,
  app_hash: HashSchema,
  last_results_hash: HashSchema,
  evidence_hash: HashSchema,
  proposer_address: AddressSchema,
});

// Block ID Schema
const BlockIdSchema = z.object({
  hash: HashSchema,
  part_set_header: z.object({
    total: z.number(),
    hash: HashSchema,
  }),
});

// Signature Schema
const SignatureSchema = z.object({
  block_id_flag: z.number(),
  validator_address: AddressSchema.optional(),
  timestamp: TimestampSchema,
  signature: z.string().nullable(),
});

// Commit Schema
const CommitSchema = z.object({
  height: HeightSchema,
  round: z.number(),
  block_id: BlockIdSchema,
  signatures: z.array(SignatureSchema),
});

// Evidence Schema (can be empty array or contain evidence items)
const EvidenceSchema = z.object({
  evidence: z.array(z.unknown()), // Evidence can vary, so using unknown for flexibility
});

// Transaction Schema
const TxSchema = z.string(); // Base64 encoded transaction

// Block Data Schema
const BlockDataSchema = z.object({
  txs: z.array(TxSchema),
});

// Main Block Schema
const BlockSchema = z.object({
  header: BlockHeaderSchema,
  data: BlockDataSchema,
  evidence: EvidenceSchema,
  last_commit: CommitSchema.nullable(),
});

// Block Response Schema (for /blocks/latest and /blocks/{height})
export const BlockResponseSchema = z.object({
  block_id: BlockIdSchema,
  block: BlockSchema,
  sdk_block: z.object({
    header: BlockHeaderSchema,
    data: BlockDataSchema,
    evidence: EvidenceSchema,
    last_commit: CommitSchema.nullable(),
  }).optional(),
});

// Current Block Height Response Schema (simplified for /blocks/latest when only height is needed)
export const CurrentBlockHeightSchema = z.object({
  block: z.object({
    header: z.object({
      height: HeightSchema,
    }),
  }),
});

// Transaction Attribute Schema
const AttributeSchema = z.object({
  key: z.string(),
  value: z.string(),
  index: z.boolean().optional(),
});

// Extended Attribute Schema for complex transactions (like authz)
const ExtendedAttributeSchema = z.object({
  key: z.string(),
  value: z.string(),
  index: z.boolean().optional(),
  authz_msg_index: z.string().optional(), // For authorization transactions
});

// Transaction Event Schema
const EventSchema = z.object({
  type: z.string(),
  attributes: z.array(z.union([AttributeSchema, ExtendedAttributeSchema])),
});

// Transaction Log Schema (updated to handle complex transactions)
const TxLogSchema = z.object({
  msg_index: z.number(),
  log: z.string(),
  events: z.array(z.object({
    type: z.string(),
    attributes: z.array(z.union([AttributeSchema, ExtendedAttributeSchema])),
  })),
});

// Transaction Result Schema
const TxResultSchema = z.object({
  code: z.number().optional(),
  data: z.string().optional(),
  log: z.string().optional(),
  info: z.string().optional(),
  gas_wanted: z.string().optional(),
  gas_used: z.string().optional(),
  events: z.array(EventSchema).optional(),
  codespace: z.string().optional(),
});

// Full Transaction Schema
const TransactionSchema = z.object({
  hash: HashSchema,
  height: HeightSchema,
  index: z.number(),
  tx_result: TxResultSchema,
  tx: TxSchema,
});

// Transaction Response Schema (for /txs/{hash})
export const TransactionResponseSchema = z.object({
  tx: z.object({
    body: z.object({
      messages: z.array(z.unknown()), // Messages can vary greatly
      memo: z.string(),
      timeout_height: z.string(),
      extension_options: z.array(z.unknown()),
      non_critical_extension_options: z.array(z.unknown()),
    }),
    auth_info: z.object({
      signer_infos: z.array(z.object({
        public_key: z.object({
          '@type': z.string(),
          key: z.string(),
        }),
        mode_info: z.object({
          single: z.object({
            mode: z.string(),
          }).optional(),
          multi: z.object({
            bitarray: z.object({
              extra_bits_stored: z.number(),
              elems: z.string(),
            }),
            mode_infos: z.array(z.unknown()),
          }).optional(),
        }),
        sequence: z.string(),
      })),
      fee: z.object({
        amount: z.array(z.object({
          denom: z.string(),
          amount: z.string(),
        })),
        gas_limit: z.string(),
        payer: z.string(),
        granter: z.string(),
      }),
      tip: z.null(),
    }),
    signatures: z.array(z.string()),
  }),
  tx_response: z.object({
    height: HeightSchema,
    txhash: HashSchema,
    codespace: z.string(),
    code: z.number(),
    data: z.string(),
    raw_log: z.string(),
    logs: z.array(TxLogSchema),
    info: z.string(),
    gas_wanted: z.string(),
    gas_used: z.string(),
    tx: z.object({
      '@type': z.string(),
      body: z.object({
        messages: z.array(z.unknown()), // Messages can vary greatly
        memo: z.string(),
        timeout_height: z.string(),
        extension_options: z.array(z.unknown()),
        non_critical_extension_options: z.array(z.unknown()),
      }),
      auth_info: z.object({
        signer_infos: z.array(z.object({
          public_key: z.object({
            '@type': z.string(),
            key: z.string(),
          }),
          mode_info: z.object({
            single: z.object({
              mode: z.string(),
            }).optional(),
            multi: z.object({
              bitarray: z.object({
                extra_bits_stored: z.number(),
                elems: z.string(),
              }),
              mode_infos: z.array(z.unknown()),
            }).optional(),
          }),
          sequence: z.string(),
        })),
        fee: z.object({
          amount: z.array(z.object({
            denom: z.string(),
            amount: z.string(),
          })),
          gas_limit: z.string(),
          payer: z.string(),
          granter: z.string(),
        }),
        tip: z.null(),
      }),
      signatures: z.array(z.string()),
    }),
    timestamp: TimestampSchema,
    events: z.array(EventSchema),
  }),
});

export type BlockResponse = z.infer<typeof BlockResponseSchema>;
export type CurrentBlockHeight = z.infer<typeof CurrentBlockHeightSchema>;
export type TransactionResponse = z.infer<typeof TransactionResponseSchema>;

export function validateBlockResponse(data: unknown): BlockResponse {
  return BlockResponseSchema.parse(data);
}

export function validateCurrentBlockHeight(data: unknown): CurrentBlockHeight {
  return CurrentBlockHeightSchema.parse(data);
}

export function validateTransactionResponse(data: unknown): TransactionResponse {
  return TransactionResponseSchema.parse(data);
}

export function safeValidateBlockResponse(data: unknown) {
  return BlockResponseSchema.safeParse(data);
}

export function safeValidateCurrentBlockHeight(data: unknown) {
  return CurrentBlockHeightSchema.safeParse(data);
}

export function safeValidateTransactionResponse(data: unknown) {
  return TransactionResponseSchema.safeParse(data);
}