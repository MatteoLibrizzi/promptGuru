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
export const DDB_PROMPTS_TABLE_NAME = 'devPromptGuru-Prompts037647B5-XLKN259Z9FYF'
export const DDB_PROMPTS_CATEGORIES_TABLE_NAME = 'devPromptGuru-PromptCategories6EE2171E-ZWIAH9VBA6FT'
export const DDB_USERS_TABLE_NAME = 'devPromptGuru-Users0A0EEA89-BMNR1WVRI1QM'
export const DDB_CHECKOUT_SESSION_TABLE_NAME = "devPromptGuru-CheckoutSessions119CA53D-WHXZQ0F9RT3J"
export const S3_PROMPT_IMAGES_BUCKET_NAME = ""
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ""
export const FREE_CREDITS_CENTS = 500
const stripeKey = process.env.STRIPE_SECRET_KEY || ""
export const STRIPE = new Stripe(stripeKey)

export const STRIPE_SUCCESS_URL = process.env.STRIPE_SUCCESS_URL || "http://localhost:3000"
export const STRIPE_CANCEL_URL = process.env.STRIPE_CANCEL_URL || "http://localhost:3000"
export const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_ENDPOINT_SECRET || ""