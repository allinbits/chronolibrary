import { Elysia } from 'elysia';
import node from '@elysiajs/node';
import { Action } from '@atomone/temporastate/dist/types';
import { useDatabase } from './database';
import { useConfig } from './config';
import { cors } from '@elysiajs/cors';

const config = useConfig();
const db = useDatabase();

function getData({ query }: { query: { limit: string; offset: string; min?: string; max?: string } }) {
    try {
        let limit = Number(query.limit) || 100;
        let offset = Number(query.offset) || 0;

        if (limit > 100) {
            limit = 100;
        }

        if (limit <= 0) {
            limit = 1;
        }

        if (offset < 0) {
            offset = 0;
        }

        if (isNaN(limit) || isNaN(offset)) {
            return { error: 'limit or offset is not a number, invalid request' };
        }

        let rows: (Omit<Action, 'amounts'> & { amounts: string })[];

        if (query.min || query.max) {
            let min = Number(query.min);
            let max = Number(query.max);

            if (isNaN(min) || isNaN(max)) {
                return { error: 'min or max in query is not a number, invalid request' };
            }

            if (min < 0) {
                min = 1;
            }

            if (max < 0 || max < min) {
                return { error: 'max must be greater than min, and max must not be zero' };
            }

            if (max - min > limit) {
                return { error: 'difference between block min and max is too large, must not exceed 100' };
            }

            rows = db.action.selectSome(min, max).toArray() as (Omit<Action, 'amounts'> & { amounts: string })[];
        } else {
            rows = db.action.selectAll.iterate().toArray() as (Omit<Action, 'amounts'> & { amounts: string })[];
        }

        const paginatedRows = rows.slice(offset, offset + limit);

        return {
            data: paginatedRows.map((row) => ({
                ...row,
                amounts: JSON.parse(row.amounts),
            })),
            total: rows.length,
            limit,
            offset,
        };
    } catch (error) {
        return { error: 'failed to read data from database' };
    }
}

function getLastBlock() {
    const result = db.lastBlock.select.get(1) as { block_value: string };
    return { lastBlock: result.block_value };
}

function getHealth() {
    return { status: 'ok' };
}

const app = new Elysia({ adapter: node() });
app.use(cors());
app.get('/data', getData);
app.get('/health', getHealth);
app.get('/last', getLastBlock);
app.listen(config.PORT ?? 3939);

console.log(`[TemporaSync] Running on ${config.PORT ?? 3939}`);
