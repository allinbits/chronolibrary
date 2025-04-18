import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import { useConfig } from './config';

if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
}

const config = useConfig();
const db = new DatabaseSync('./data/db.sqlite');

export function useDatabase() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS actions (
            hash TEXT PRIMARY KEY,
            height TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            memo TEXT NOT NULL,
            messages JSONB NOT NULL
        );`);

    db.exec(`
        CREATE TABLE IF NOT EXISTS last_block (
            id INTEGER PRIMARY KEY,
            block_value TEXT NOT NULL
        );`);

    // Only inserts a row if the row does not exist.
    db.prepare(`INSERT OR IGNORE INTO last_block (id, block_value) VALUES (1, ?);`).run(config.START_BLOCK);

    return {
        action: {
            insert: db.prepare(`
                INSERT INTO actions (hash, height, timestamp, memo, messages) 
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT (hash) DO NOTHING
            `),
        },
        lastBlock: {
            select: db.prepare(`SELECT * FROM last_block WHERE id = ?`),
            update: db.prepare(`UPDATE last_block SET block_value = ? WHERE id = ?;`),
        },
    };
}
