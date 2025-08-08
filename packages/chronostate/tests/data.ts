import { generateConfigDefaults } from "../src";
import { TransactionResponse } from "../src/types/transaction";

const APIS = [
    'https://atomone-api.allinbits.com',
    `https://atomone-rest.publicnode.com`,
]

export const BAD_CONFIG = generateConfigDefaults({ 
    START_BLOCK: '-1',
    API_URLS: [
        'https://fake-api.allinbits.com',
    ],
});

export const MIXED_CONFIG = generateConfigDefaults({ 
    START_BLOCK: '-1',
    API_URLS: [
        'https://fake-api.allinbits.com',
        ...APIS
    ],
});

export const GOOD_CONFIG = generateConfigDefaults({ 
    START_BLOCK: '-1',
    API_URLS: [
        ...APIS
    ],
});

export const txResponse: TransactionResponse = {
    tx: {
        body: {
            messages: [
                {
                    '@type': '/cosmos.bank.v1beta1.MsgSend',
                    from_address: 'atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250',
                    to_address: 'atone1h36dsx4pflgjmesct389faxpqtxczj3lqjmu9s',
                    amount: [
                        {
                            denom: 'uatone',
                            amount: '16500000',
                        },
                    ],
                    msgs: []
                },
            ],
            memo: '',
            timeout_height: '0',
            extension_options: [],
            non_critical_extension_options: [],
        },
        auth_info: {
            signer_infos: [
                {
                    public_key: {
                        '@type': '/cosmos.crypto.secp256k1.PubKey',
                        key: 'Avha9KUAwVBpjuEGgJ0BhTj2prdtB0nnuKJVGgXpswYH',
                    },
                    mode_info: {
                        single: {
                            mode: 'SIGN_MODE_LEGACY_AMINO_JSON',
                        },
                    },
                    sequence: '56',
                },
            ],
            fee: {
                amount: [
                    {
                        denom: 'uatone',
                        amount: '2704',
                    },
                ],
                gas_limit: '67590',
                payer: '',
                granter: '',
            },
            tip: null,
        },
        signatures: ['MUSwybUyY3hl719ep+98HIGwXvuuZSWkdLWYA36eICBdbAzKL1JhqxQI+eh9V39JyskQrA4Gnl7+8clWaHJ/GQ=='],
    },
    tx_response: {
        height: '2699798',
        txhash: '34708B146F71A27C31F80B6A91C7FC6BE8DF62D2D8161415DE90B0D9F37DB24E',
        codespace: '',
        code: 0,
        data: '12260A242F636F736D6F732E62616E6B2E763162657461312E4D736753656E64526573706F6E7365',
        raw_log:
            '[{"msg_index":0,"events":[{"type":"message","attributes":[{"key":"action","value":"/cosmos.bank.v1beta1.MsgSend"},{"key":"sender","value":"atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250"},{"key":"module","value":"bank"}]},{"type":"coin_spent","attributes":[{"key":"spender","value":"atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250"},{"key":"amount","value":"16500000uatone"}]},{"type":"coin_received","attributes":[{"key":"receiver","value":"atone1h36dsx4pflgjmesct389faxpqtxczj3lqjmu9s"},{"key":"amount","value":"16500000uatone"}]},{"type":"transfer","attributes":[{"key":"recipient","value":"atone1h36dsx4pflgjmesct389faxpqtxczj3lqjmu9s"},{"key":"sender","value":"atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250"},{"key":"amount","value":"16500000uatone"}]},{"type":"message","attributes":[{"key":"sender","value":"atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250"}]}]}]',
        logs: [
            {
                msg_index: 0,
                log: '',
                events: [
                    {
                        type: 'message',
                        attributes: [
                            {
                                key: 'action',
                                value: '/cosmos.bank.v1beta1.MsgSend',
                            },
                            {
                                key: 'sender',
                                value: 'atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250',
                            },
                            {
                                key: 'module',
                                value: 'bank',
                            },
                        ],
                    },
                    {
                        type: 'coin_spent',
                        attributes: [
                            {
                                key: 'spender',
                                value: 'atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250',
                            },
                            {
                                key: 'amount',
                                value: '16500000uatone',
                            },
                        ],
                    },
                    {
                        type: 'coin_received',
                        attributes: [
                            {
                                key: 'receiver',
                                value: 'atone1h36dsx4pflgjmesct389faxpqtxczj3lqjmu9s',
                            },
                            {
                                key: 'amount',
                                value: '16500000uatone',
                            },
                        ],
                    },
                    {
                        type: 'transfer',
                        attributes: [
                            {
                                key: 'recipient',
                                value: 'atone1h36dsx4pflgjmesct389faxpqtxczj3lqjmu9s',
                            },
                            {
                                key: 'sender',
                                value: 'atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250',
                            },
                            {
                                key: 'amount',
                                value: '16500000uatone',
                            },
                        ],
                    },
                    {
                        type: 'message',
                        attributes: [
                            {
                                key: 'sender',
                                value: 'atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250',
                            },
                        ],
                    },
                ],
            },
        ],
        info: '',
        gas_wanted: '67590',
        gas_used: '54769',
        tx: {
            '@type': '/cosmos.tx.v1beta1.Tx',
            body: {
                messages: [
                    {
                        '@type': '/cosmos.bank.v1beta1.MsgSend',
                        from_address: 'atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250',
                        to_address: 'atone1h36dsx4pflgjmesct389faxpqtxczj3lqjmu9s',
                        amount: [
                            {
                                denom: 'uatone',
                                amount: '16500000',
                            },
                        ],
                        msgs: []
                    },
                ],
                memo: '',
                timeout_height: '0',
                extension_options: [],
                non_critical_extension_options: [],
            },
            auth_info: {
                signer_infos: [
                    {
                        public_key: {
                            '@type': '/cosmos.crypto.secp256k1.PubKey',
                            key: 'Avha9KUAwVBpjuEGgJ0BhTj2prdtB0nnuKJVGgXpswYH',
                        },
                        mode_info: {
                            single: {
                                mode: 'SIGN_MODE_LEGACY_AMINO_JSON',
                            },
                        },
                        sequence: '56',
                    },
                ],
                fee: {
                    amount: [
                        {
                            denom: 'uatone',
                            amount: '2704',
                        },
                    ],
                    gas_limit: '67590',
                    payer: '',
                    granter: '',
                },
                tip: null,
            },
            signatures: ['MUSwybUyY3hl719ep+98HIGwXvuuZSWkdLWYA36eICBdbAzKL1JhqxQI+eh9V39JyskQrA4Gnl7+8clWaHJ/GQ=='],
        },
        timestamp: '2025-04-17T00:30:59Z',
        events: [
            {
                type: 'coin_spent',
                attributes: [
                    {
                        key: 'spender',
                        value: 'atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250',
                        index: true,
                    },
                    {
                        key: 'amount',
                        value: '2704uatone',
                        index: true,
                    },
                ],
            },
            {
                type: 'coin_received',
                attributes: [
                    {
                        key: 'receiver',
                        value: 'atone17xpfvakm2amg962yls6f84z3kell8c5l7el8a9',
                        index: true,
                    },
                    {
                        key: 'amount',
                        value: '2704uatone',
                        index: true,
                    },
                ],
            },
            {
                type: 'transfer',
                attributes: [
                    {
                        key: 'recipient',
                        value: 'atone17xpfvakm2amg962yls6f84z3kell8c5l7el8a9',
                        index: true,
                    },
                    {
                        key: 'sender',
                        value: 'atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250',
                        index: true,
                    },
                    {
                        key: 'amount',
                        value: '2704uatone',
                        index: true,
                    },
                ],
            },
            {
                type: 'message',
                attributes: [
                    {
                        key: 'sender',
                        value: 'atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250',
                        index: true,
                    },
                ],
            },
            {
                type: 'tx',
                attributes: [
                    {
                        key: 'fee',
                        value: '2704uatone',
                        index: true,
                    },
                    {
                        key: 'fee_payer',
                        value: 'atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250',
                        index: true,
                    },
                ],
            },
            {
                type: 'tx',
                attributes: [
                    {
                        key: 'acc_seq',
                        value: 'atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250/56',
                        index: true,
                    },
                ],
            },
            {
                type: 'tx',
                attributes: [
                    {
                        key: 'signature',
                        value: 'MUSwybUyY3hl719ep+98HIGwXvuuZSWkdLWYA36eICBdbAzKL1JhqxQI+eh9V39JyskQrA4Gnl7+8clWaHJ/GQ==',
                        index: true,
                    },
                ],
            },
            {
                type: 'message',
                attributes: [
                    {
                        key: 'action',
                        value: '/cosmos.bank.v1beta1.MsgSend',
                        index: true,
                    },
                    {
                        key: 'sender',
                        value: 'atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250',
                        index: true,
                    },
                    {
                        key: 'module',
                        value: 'bank',
                        index: true,
                    },
                ],
            },
            {
                type: 'coin_spent',
                attributes: [
                    {
                        key: 'spender',
                        value: 'atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250',
                        index: true,
                    },
                    {
                        key: 'amount',
                        value: '16500000uatone',
                        index: true,
                    },
                ],
            },
            {
                type: 'coin_received',
                attributes: [
                    {
                        key: 'receiver',
                        value: 'atone1h36dsx4pflgjmesct389faxpqtxczj3lqjmu9s',
                        index: true,
                    },
                    {
                        key: 'amount',
                        value: '16500000uatone',
                        index: true,
                    },
                ],
            },
            {
                type: 'transfer',
                attributes: [
                    {
                        key: 'recipient',
                        value: 'atone1h36dsx4pflgjmesct389faxpqtxczj3lqjmu9s',
                        index: true,
                    },
                    {
                        key: 'sender',
                        value: 'atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250',
                        index: true,
                    },
                    {
                        key: 'amount',
                        value: '16500000uatone',
                        index: true,
                    },
                ],
            },
            {
                type: 'message',
                attributes: [
                    {
                        key: 'sender',
                        value: 'atone1g775g5u284q96zq8d0q948tj50l3luf7cwu250',
                        index: true,
                    },
                ],
            },
        ],
    },
};
