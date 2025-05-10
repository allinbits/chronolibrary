export type TicTacGame = {
    author: string;
    opponent: string;
    hash: string;
    last_updated: Date;
    current_move: 'author' | 'opponent';
    moves: Array<{ position: number; type: 'X' | 'O' }>;
    winner?: string;
    isFinished?: boolean;
};

export function getGameBoard(moves: { position: number; type: 'X' | 'O' }[]) {
    const board: (string | null)[][] = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];

    for (const move of moves) {
        const row = Math.floor(move.position / 3);
        const col = move.position % 3;
        board[row][col] = move.type;
    }

    return board;
}

export function verifyGameState(moves: { position: number; type: 'X' | 'O' }[]) {
    // Represent the board as a 2D array for easier win checking
    const board: (string | null)[][] = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ];

    // Populate the board with the moves
    for (const move of moves) {
        const row = Math.floor(move.position / 3);
        const col = move.position % 3;
        board[row][col] = move.type;
    }

    // Check rows for a win
    for (let i = 0; i < 3; i++) {
        if (board[i][0] && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
            return board[i][0];
        }
    }

    // Check columns for a win
    for (let j = 0; j < 3; j++) {
        if (board[0][j] && board[0][j] === board[1][j] && board[0][j] === board[2][j]) {
            return board[0][j];
        }
    }

    // Check diagonals for a win
    if (board[0][0] && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
        return board[0][0];
    }
    if (board[0][2] && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
        return board[0][2];
    }

    // No winner found
    return undefined;
}

export function getGamePiece(address: string, game: TicTacGame) {
    if (game.current_move === 'author' && game.author === address) {
        return 'X';
    }

    if (game.current_move === 'opponent' && game.opponent === address) {
        return 'O';
    }

    return game.author === address ? 'X' : 'O';
}
