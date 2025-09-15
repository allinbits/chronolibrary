import pg from 'pg';
import { useConfig } from './config';
import { Action } from '@atomone/chronostate';

const { Pool } = pg;

const config = useConfig();
const pool = new Pool({
    connectionString: config.PG_URI,
});

export async function initDatabase() {
    const client = await pool.connect();

    // Create last_block table
    await client.query(`
        CREATE TABLE IF NOT EXISTS last_block (
            id INT PRIMARY KEY,
            block TEXT NOT NULL
        );`);

    // Create actions table
    await client.query(`
        CREATE TABLE IF NOT EXISTS actions (
            hash TEXT PRIMARY KEY,
            height TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            memo TEXT NOT NULL,
            messages JSONB NOT NULL
        );`);

    // Insert default row for last_block if missing
    await client.query(
        `INSERT INTO last_block (id, block)
             VALUES (0, $1)
             ON CONFLICT (id) DO NOTHING`,
        [config.START_BLOCK]
    );

    client.release();
}

export function useDatabase() {
    return {
        action: {
            insert: async (actionData: Action, formattedMessages: string) => {
                return await pool.query(
                    `INSERT INTO actions (hash, height, timestamp, memo, messages) 
                    VALUES ($1, $2, $3, $4, $5)
                    ON CONFLICT (hash) DO NOTHING`,
                    [
                        actionData.hash,
                        actionData.height,
                        actionData.timestamp,
                        actionData.memo,
                        formattedMessages,
                    ]
                );
            },
        },
        lastBlock: {
            select: async () => {
                const result = await pool.query('SELECT block FROM last_block WHERE id = 0');
                return result.rows[0]?.block ?? null;
            },
            update: async (newBlock: string) => {
                await pool.query(`UPDATE last_block SET block = $1 WHERE id = 0`, [newBlock]);
            },
        },
    };
}
