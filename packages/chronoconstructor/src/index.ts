import { type Action } from '@atomone/chronostate';

export class ChronoConstructor<T = {}> {
    private mappings: { [key: string]: (dataSet: T, action: Action) => Promise<void> | void } = Object.create(null);
    private lastBlock: number = -1;
    private namespace: string;

    /**
     * When creating a new class, specify what your prefix / namespace is.
     *
     * ie. `0xForum`, `MyNameSpace`, etc.
     *
     * @param {string} namespace
     * @memberof ChronoConstructor
     */
    constructor(namespace: string) {
        this.namespace = namespace;
    }

    /**
     * Bind a specific action under the `a` query to a specific function.
     *
     * Example query: `example.Send("blah", "blah", "blah")`
     *
     * Example usage: `addAction('CREATE_THREAD', YOUR_CALLBACK_HERE)`;
     *
     * @param {string} action
     * @param {((dataSet: T, action: Action) => Promise<void> | void)} callback
     * @memberof ChronoConstructor
     */
    addAction(action: string, callback: (dataSet: T, action: Action) => Promise<void> | void) {
        this.mappings[action] = callback;
    }

    /**
     * Parses all actions from a fetch request, and applies them to an existing data set.
     *
     * Best practice is that when you load your data from the API endpoint, you parse all of the actions to reconstruct state.
     *
     * Then you feed this function any additional blocks that need parsing.
     *
     * Modified data will be returned after all actions are parsed.
     *
     * @param {Action[]} actions
     * @param {T} existingData
     * @return {*}
     * @memberof ChronoConstructor
     */
    async parse(actions: Action[], existingData: T): Promise<T> {
        const dataClone = structuredClone(existingData);
        for (let action of actions) {
            if (parseInt(action.height) < this.lastBlock) {
                continue;
            }

            const data = extractNamespaceFunction(action.memo);
            if (data?.namespace !== this.namespace) {
                console.warn(`Skipped Action ${action.hash}, invalid namespace or parameters`);
                continue;
            }

            if (!this.mappings[data.functionName]) {
                console.warn(`Invalid action code ${data.functionName}, no mappings created for function name.`);
                continue;
            }

            await this.mappings[data.functionName](dataClone, action);
            this.lastBlock = parseInt(action.height);
        }

        return dataClone;
    }

    /**
     * Parses all actions from a fetch request, and applies them to an existing data set.
     *
     * Best practice is that when you load your data from the API endpoint, you parse all of the actions to reconstruct state.
     *
     * Then you feed this function any additional blocks that need parsing.
     *
     * This will directly modify the existing data, will not return anything.
     *
     * @param {Action[]} actions
     * @param {T} existingData
     * @return {*}
     * @memberof ChronoConstructor
     */
    async parseDirect(actions: Action[], existingData: T): Promise<void> {
        for (let action of actions) {
            if (parseInt(action.height) < this.lastBlock) {
                continue;
            }

            const data = extractNamespaceFunction(action.memo);
            if (data?.namespace !== this.namespace) {
                console.warn(`Skipped Action ${action.hash}, invalid namespace or parameters`);
                continue;
            }

            if (!this.mappings[data.functionName]) {
                console.warn(`Invalid action code ${data.functionName}, no mappings created for function name.`);
                continue;
            }

            await this.mappings[data.functionName](existingData, action);
            this.lastBlock = parseInt(action.height);
        }
    }

    /**
     * Returns the last block parsed
     *
     * @return {number} 
     * @memberof ChronoConstructor
     */
    getLastBlock() {
        return this.lastBlock;
    }
}

/**
 * Extracts the namespace, and function name from a memo.
 *
 * Returns null if the function is invalid.
 *
 * @export
 * @param {string} memo
 * @return {null | { namespace: string, functionName: string }}
 */
export function extractNamespaceFunction(memo: string) {
    const [namespaceFunction] = memo.split('(');
    if (!namespaceFunction) {
        return null;
    }

    const [namespace, func] = namespaceFunction.split('.');
    if (!namespace || !func) {
        return null;
    }

    return {
        namespace,
        functionName: func,
    };
}

/**
 * Input should be the full memo. ie. `example.send("blah","blah","blah")`
 * commandPrefix should be the full command name. ie `example.Send`
 * 
 * Arguments are extracted as long as they are surrounded by `double quotes`.
 * 
 * Example: `"blah", "blah", "blah"`
 *
 * @export
 * @param {string} memo
 * @param {string} commandPrefix
 * @return {*}
 */
export function extractMemoContent(memo: string, commandPrefix: string) {
    const start = `${commandPrefix}(`;
    const end = `)`;

    // Check if the memo starts with the command and ends with ')'
    if (memo.startsWith(start) && memo.endsWith(end)) {
        const content = memo.slice(start.length, -1);

        let inString = false;
        let currentItem = '';
        const result = [];

        for (let i = 0; i < content.length; i++) {
            const char = content[i];

            if (char === '"' && (i === 0 || content[i - 1] !== '\\')) {
                inString = !inString;
            }

            if (char === ',' && !inString) {
                result.push(currentItem);
                currentItem = '';
            } else {
                currentItem += char;
            }
        }

        result.push(currentItem);

        return result.map((item) => {
            item = item.trim();
            if (item.startsWith('"') && item.endsWith('"')) {
                return item.slice(1, -1);
            }
            return item;
        });
    }

    return [];
}