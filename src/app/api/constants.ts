import { DDBPromptsRepository, LocalPromptsRepository } from "./Repositories/prompts";

import {
    DynamoDBClient,
} from '@aws-sdk/client-dynamodb';

export const DDB_CLIENT = new DynamoDBClient({
    region: 'eu-west-1'
});
export const DDB_PROMPTS_TABLE_NAME = 'devPromptGuru-Prompts037647B5-18DRWKVU3EZ74'
export const DDB_USERS_TABLE_NAME = 'devPromptGuru-UsersCreditsECEEC0C7-ZZWGB3RKMYJR'
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY
export const FREE_CREDITS_CENTS = 500