import { LocalPromptsRepository } from "./repositories/prompts";

import {
    DynamoDBClient,
} from '@aws-sdk/client-dynamodb';

export const PROMPTS_REPOSITORY = new LocalPromptsRepository()

export const DDB_CLIENT = new DynamoDBClient({
    region: 'eu-west-1'
});
export const DDB_PROMPTS_TABLE_NAME = 'devPromptGuru-Prompts037647B5-18DRWKVU3EZ74'
