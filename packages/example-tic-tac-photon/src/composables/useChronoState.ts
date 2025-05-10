/* eslint-disable @typescript-eslint/no-namespace */
import { ref } from 'vue';
import { type Action, ChronoState, extractMemoContent } from '@atomone/chronostate';

import { type TicTacGame, verifyGameState } from '../shared/game';

import { useKeplr } from './useKeplr';

declare module '@atomone/chronostate' {
    export namespace MemoExtractor {
        export interface TypeMap {
            'TicTac.Play': [string]; // opponent_address
            'TicTac.Move': [string, string]; // transactionHash, move
        }
    }
}

const lastHash = ref('');
const lastBlock = ref('');
const games = ref<TicTacGame[]>([]);
let state: ChronoState;

function handleAction(action: Action) {
    if (lastHash.value === action.hash) {
        return;
    }

    lastHash.value = action.hash;

    const msg = action.messages.find(x => x['@type'] == '/cosmos.bank.v1beta1.MsgSend');
    if (!msg) {
        return;
    }

    const keplr = useKeplr();
    const { from_address } = msg;

    // Look for starting games...
    if (action.memo.startsWith('TicTac.Play')) {
        const [opponentAddress] = extractMemoContent(action.memo, 'TicTac.Play');
        if (!opponentAddress) {
            console.warn(`Skipped ${action.hash}, missing address for game start`);
            return;
        }

        // No duplicate games
        if (games.value.findIndex(x => x.hash === action.hash) >= 0) {
            return;
        }

        // Find any matching games that involve the connected player
        if (opponentAddress !== keplr.account && from_address !== keplr.account) {
            return;
        }

        // Construct new game
        const newGame: TicTacGame = {
            author: from_address,
            opponent: opponentAddress,
            hash: action.hash,
            last_updated: new Date(action.timestamp),
            current_move: (new Date(action.timestamp)).getTime() % 2 === 0 ? 'author' : 'opponent',
            moves: [],
        };

        // Add new game
        games.value.unshift(newGame);
        return;
    }

    // Look for Moves...
    if (action.memo.startsWith('TicTac.Move')) {
        const [gameHash, gameMove] = extractMemoContent(action.memo, 'TicTac.Move');
        if (!gameHash || !gameMove) {
            console.warn(`Ignoring malformed game moves from ${action.hash}`);
            return;
        }

        // Check if they have a matching game
        const existingGameIndex = games.value.findIndex(x => x.hash === gameHash);
        if (existingGameIndex <= -1) {
            console.warn(`Skipping game ${gameHash}, not a game we are involved in.`);
            return;
        }

        if (games.value[existingGameIndex].isFinished) {
            console.warn(`Skipping game ${gameHash}, games has concluded.`);
            return;
        }

        if (from_address !== games.value[existingGameIndex].author && from_address !== games.value[existingGameIndex].opponent) {
            console.warn(`Skipped ${gameHash}, third-party trying to play the game`);
            return;
        }

        // Check if the current move is the author, and if it is the author and they are not the author skip their memo
        if (games.value[existingGameIndex].current_move === 'author' && from_address !== games.value[existingGameIndex].author) {
            console.warn(`Skipped turn for ${gameHash}, not their turn.`);
            return;
        }

        // Check if the current move is the opponent, and if it is the opponent and they are not the opponent skip their memo
        if (games.value[existingGameIndex].current_move === 'opponent' && from_address !== games.value[existingGameIndex].opponent) {
            console.warn(`Skipped turn for ${gameHash}, not their turn.`);
            return;
        }

        const position = parseInt(gameMove);
        if (games.value[existingGameIndex].moves.find(x => x.position === position)) {
            console.warn(`Skipped position ${position} for ${gameHash}, position already filled.`);
            return;
        }

        const gamePiece = games.value[existingGameIndex].current_move === 'author' ? 'X' : 'O';
        games.value[existingGameIndex].moves.push({ position, type: gamePiece });
        games.value[existingGameIndex].current_move = games.value[existingGameIndex].current_move === 'author' ? 'opponent' : 'author';

        if (games.value[existingGameIndex].moves.length >= 9) {
            games.value[existingGameIndex].isFinished = true;
        }

        const winner = verifyGameState(games.value[existingGameIndex].moves);
        if (winner) {
            games.value[existingGameIndex].winner = winner === 'X' ? games.value[existingGameIndex].author : games.value[existingGameIndex].opponent;
            games.value[existingGameIndex].isFinished = true;
        }
    }
}

export function useChronoState() {
    const start = () => {
        if (!state) {
            state = new ChronoState({
                API_URLS: ['https://atomone-testnet-1-api.allinbits.services'],
                MEMO_PREFIX: '',
                RECEIVER: 'atone1uq6zjslvsa29cy6uu75y8txnl52mw06j6fzlep',
                START_BLOCK: '1517713',
                BATCH_SIZE: 250,
                LOG: true,
            });

            state.onAction(handleAction);
            state.onLastBlock((block) => {
                lastBlock.value = block;
            });
        }

        state.start();
    };

    const stop = () => {
        state.stop();
    };

    return {
        stop,
        start,
        games,
        lastBlock,
    };
}
