import { Config } from '@atomone/chronostate/dist/types';

type TemporaSyncConfig = {
	PORT: number,
}

let config: Config & TemporaSyncConfig;

export function useConfig(): Config & TemporaSyncConfig {
	if (typeof config !== 'undefined') {
		return config;
	}

    if (!process.env.START_BLOCK) {
        console.error(`Failed to specify START_BLOCK in configuration`);
        process.exit(1);
    }

    config = {
        API_URLS: process.env.API_URLS ? process.env.API_URLS.split(',') : [],
        MEMO_PREFIX: process.env.MEMO_PREFIX,
        BATCH_SIZE: process.env.BATCH_SIZE ? parseInt(process.env.BATCH_SIZE) : 50,
        START_BLOCK: process.env.START_BLOCK,
        RECEIVER: process.env.RECEIVER,
        SENDER: process.env.SENDER,
        LOG: process.env.LOG === 'true' ? true : false,
		PORT: process.env.PORT ? parseInt(process.env.PORT) : 3939
    };

	console.log(`Configuration`);
	console.log(config);

	return config;
}
