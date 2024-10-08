import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import {
	CorsHttpMethod,
	HttpApi,
	HttpMethod
} from '@aws-cdk/aws-apigatewayv2-alpha'
import * as cdk from 'aws-cdk-lib'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as iam from 'aws-cdk-lib/aws-iam'
import {
	Effect,
	ManagedPolicy,
	PolicyStatement,
	Role,
	ServicePrincipal,
} from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment'
import { Construct } from 'constructs'
import { LambdaIntegration, LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
// TODO make sure people can pay

export class PromptGuruStack extends cdk.Stack {
	prod: boolean

	createPromptsDDBTable = () => {
		const prompts = new dynamodb.Table(
			this,
			"Prompts",
			{
				// rename to promptId
				partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
				sortKey: { name: "creator#TS", type: dynamodb.AttributeType.STRING },
				billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
				removalPolicy: cdk.RemovalPolicy.RETAIN,
			}
		)

		return prompts
	}

	createPromptCategoriesDDBTable = () => {
		const promptCategories = new dynamodb.Table(
			this,
			"PromptCategories",
			{
				partitionKey: { name: "category", type: dynamodb.AttributeType.STRING },
				sortKey: { name: "promptId", type: dynamodb.AttributeType.STRING },
				billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
				removalPolicy: cdk.RemovalPolicy.RETAIN,
			}
		)

		promptCategories.addGlobalSecondaryIndex(
			{
				indexName: "PromptIdIndex",
				partitionKey: { name: "promptId", type: dynamodb.AttributeType.STRING },
				projectionType: dynamodb.ProjectionType.KEYS_ONLY,
			},
		)

		return promptCategories
	}

	createUsersDDBTable = () => {
		const users = new dynamodb.Table(
			this,
			"Users",
			{
				partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
				sortKey: { name: "dataType", type: dynamodb.AttributeType.STRING },
				// METADATA
				// TRANSACTION#TS
				billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
				removalPolicy: cdk.RemovalPolicy.RETAIN,
			}
		)

		return users
	}

	createCheckoutSessionsDDBTable = () => {
		const checkoutSessions = new dynamodb.Table(
			this,
			"CheckoutSessions",
			{
				partitionKey: { name: "sessionId", type: dynamodb.AttributeType.STRING },
				sortKey: { name: "checkoutTimestamp", type: dynamodb.AttributeType.NUMBER },
				billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
				removalPolicy: cdk.RemovalPolicy.RETAIN,
			}
		)

		return checkoutSessions
	}

	createPromptImagesBucket = () => {
		const promptImagesBucket = new s3.Bucket(
			this,
			"PromptImages",
			{

			}
		)
		// promptImagesBucket.addToResourcePolicy(
		// 	new iam.PolicyStatement({
		// 		actions: ['s3:GetObject'],
		// 		resources: [`${promptImagesBucket.bucketArn}/*`],
		// 		principals: [new iam.AnyPrincipal()],
		// 		effect: iam.Effect.ALLOW,
		// 	})
		// );
		return promptImagesBucket
	}


	// TODO setup IAM user with limited access to assign to vercel

	constructor(scope: Construct, id: string, prod: boolean, props?: cdk.StackProps) {
		super(scope, id, props)

		this.prod = prod;

		const promptsDDBTable = this.createPromptsDDBTable()
		const userCreditsDDBTable = this.createUsersDDBTable()
		const promptCategoriesDDBTable = this.createPromptCategoriesDDBTable()
		const checkoutSessionsDDBTable = this.createCheckoutSessionsDDBTable()
		// const promptImagesBucket = this.createPromptImagesBucket()
	}
}
