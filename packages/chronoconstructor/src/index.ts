export interface Action {
    hash: string;
    height: string;
    timestamp: string;
    from_address: string;
    to_address: string;
    memo: string;
    amounts: Array<{
        denom: string;
        amount: string;
    }>;
}

export class ChronoConstructor<T = {}> {
    lastBlock: string = '';

    private mappings: { [key: string]: (dataSet: T, action: Action) => Promise<void> | void } = {};
    private prefix: string;

    /**
     * When creating a new class, specify what your prefix / namespace is.
     * 
     * ie. `0xForum`, `MyNameSpace`, etc.
     * 
     * @param {string} memoPrefix
     * @memberof ChronoConstructor
     */
    constructor(memoPrefix: string) {
        this.prefix = memoPrefix;
    }

    /**
     * Bind a specific action under the `a` query to a specific function.
     * 
     * Example query: `0xForum?a=CREATE_THREAD&t=Some Title&c=Some Content`
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
        const dataClone = JSON.parse(JSON.stringify(existingData));

        for (let action of actions) {
            const params = new URLSearchParams(action.memo.replace(`${this.prefix}?`, ''));
            const actionCode = params.get('a');
            if (!actionCode) {
                console.warn(`Skipped Action ${action.hash}, invalid parameters`);
                continue;
            }

            if (!this.mappings[actionCode]) {
                console.warn(`Invalid action code ${actionCode}`);
                continue;
            }

            await this.mappings[actionCode](dataClone, action);
        }

        if (actions.length >= 1) {
            this.lastBlock = actions[actions.length - 1].height;
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
            const params = new URLSearchParams(action.memo.replace(`${this.prefix}?`, ''));
            const actionCode = params.get('a');
            if (!actionCode) {
                console.warn(`Skipped Action ${action.hash}, invalid parameters`);
                continue;
            }

            if (!this.mappings[actionCode]) {
                console.warn(`Invalid action code ${actionCode}`);
                continue;
            }

            await this.mappings[actionCode](existingData, action);
        }

        if (actions.length >= 1) {
            this.lastBlock = actions[actions.length - 1].height;
        }
    }
}
