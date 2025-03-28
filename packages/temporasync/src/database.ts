import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import { useConfig } from './config';

if (!fs.existsSync('./data')) {
    fs.mkdirSync('./data');
}

const config = useConfig();
const db = new DatabaseSync('./data/db.sqlite');

function getQuery(path: string) {
    return fs.readFileSync((process.cwd() + path).replace(/\\/gm, '/'), 'utf-8');
}

export function useDatabase() {
    db.exec(getQuery('/src/queries/createTableActions.sql'));
    db.exec(getQuery('/src/queries/createTableLastBlock.sql'));

    // Only inserts a row if the row does not exist.
    db.prepare(getQuery('/src/queries/insertLastBlockNonExistant.sql')).run(config.START_BLOCK);

    return {
        action: {
            insert: db.prepare(getQuery('/src/queries/insertAction.sql')),
            select: db.prepare(getQuery('/src/queries/selectAction.sql')),
            selectAll: db.prepare(getQuery('/src/queries/selectAllActions.sql')),
            selectSome(minBlock: number, maxBlock: number) {
                return db.prepare(getQuery('/src/queries/selectSomeActions.sql')).iterate(minBlock, maxBlock);
            }
        },
        lastBlock: {
            select: db.prepare(getQuery('/src/queries/selectLastBlock.sql')),
            update: db.prepare(getQuery('/src/queries/updateLastBlock.sql')),
        },
    };
}
