import { Stripe } from 'stripe';
import {
    DynamoDBClient,
} from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';

export const DDB_CLIENT = new DynamoDBClient({
    region: 'eu-west-1'
});
export const S3_CLIENT = new S3Client({
    region: 'eu-west-1'
});

export const APP_URL = process.env.APP_URL = ""

export const DDB_PROMPTS_TABLE_NAME = process.env.DDB_PROMPTS_TABLE_NAME || ''
export const DDB_PROMPTS_CATEGORIES_TABLE_NAME = process.env.DDB_PROMPTS_CATEGORIES_TABLE_NAME || ''
export const DDB_USERS_TABLE_NAME = process.env.DDB_USERS_TABLE_NAME || ''
export const DDB_CHECKOUT_SESSION_TABLE_NAME = process.env.DDB_CHECKOUT_SESSION_TABLE_NAME || ""
export const S3_PROMPT_IMAGES_BUCKET_NAME = ""
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ""
export const FREE_CREDITS_CENTS = 500
const stripeKey = process.env.STRIPE_SECRET_KEY || ""
export const STRIPE = new Stripe(stripeKey)

export const STRIPE_SUCCESS_URL = process.env.STRIPE_SUCCESS_URL || "http://localhost:3000"
export const STRIPE_CANCEL_URL = process.env.STRIPE_CANCEL_URL || "http://localhost:3000"
export const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_ENDPOINT_SECRET || ""