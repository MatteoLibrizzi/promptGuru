import { GetItemCommand, PutItemCommand, PutItemCommandInput, QueryCommand, QueryCommandInput, UpdateItemCommand } from "@aws-sdk/client-dynamodb"
import { DDB_CHECKOUT_SESSION_TABLE_NAME, DDB_CLIENT, DDB_USERS_TABLE_NAME, FREE_CREDITS_CENTS } from "@/app/api/constants"
import { unmarshall } from "@aws-sdk/util-dynamodb";// TODO maybe use marshal instead of ddb parser


export interface Transaction {
    amount: number
    transactionTimestamp: number
    description: string
    promptId?: string
}
export abstract class UsersRepository {

    abstract createNewUser: (userInput: UserInput) => Promise<void>
    abstract isExistingUser: (userId: string) => Promise<boolean>
    abstract createUserIfNotExistent: (userId: string) => Promise<void>
    abstract getUserBalance: (userId: string) => Promise<number>
    abstract getUserTransactions: (userId: string) => Promise<Transaction[]>
    abstract addTransaction: (userId: string, transaction: Transaction) => Promise<void>
    abstract createCheckoutSession: (userId: string, checkoutSessionId: string, priceId: string) => Promise<void>
    abstract getCheckoutSessionById: (checkoutSessionId: string) => Promise<CheckoutSession>
    abstract confirmPaymentForCheckoutSession: (checkoutSessionId: string, checkoutTimestamp: number) => Promise<void>
}


export type UserId = string
export interface UserInput {
    userId: UserId
}

export class MockUsersRepository extends UsersRepository {
    createCheckoutSession: (userId: string, checkoutSessionId: string, priceId: string) => Promise<void> =
        async () => { }
    getCheckoutSessionById: (checkoutSessionId: string) => Promise<CheckoutSession> =
        async () => ({ userId: "", checkoutTimestamp: 0, checkoutSessionId: "", priceId: "" })
    confirmPaymentForCheckoutSession: (checkoutSessionId: string, checkoutTimestamp: number) => Promise<void>
        = async () => { }
    addTransaction: (userId: string, transaction: Transaction) => Promise<void> = async () => { }
    getUserBalance: (userId: string) => Promise<number> = async () => 1
    getUserTransactions: (userId: string) => Promise<Transaction[]> = async () => []
    isExistingUser = async (userId: UserId) => true
    createNewUser = async (userInput: UserInput) => { }
    createUserIfNotExistent = async (userId: UserId) => { }
}

enum UserTableDataType {
    METADATA = "METADATA",
    TRANSACTION = "TRANSACTION",
};

enum CheckoutSessionStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
}

export interface CheckoutSession {
    userId: UserId
    checkoutTimestamp: number
    checkoutSessionId: string
    priceId: string
}

export class DDBUsersRepository extends UsersRepository {
    createCheckoutSession: (userId: string, checkoutSessionId: string, priceId: string) => Promise<void> = async (userId: string, checkoutSessionId, priceId) => {
        const params = {
            TableName: DDB_CHECKOUT_SESSION_TABLE_NAME,
            Item: {
                sessionId: { S: checkoutSessionId },
                checkoutTimestamp: { N: Date.now().toString() },
                status: { S: CheckoutSessionStatus.PENDING },
                userId: { S: userId },
                priceId: { S: priceId }
            },
        };

        const command = new PutItemCommand(params);

        try {
            await DDB_CLIENT.send(command);
        } catch (err) {
            console.error("Error creating checkout session:", err);
            throw err;
        }
    }
    getCheckoutSessionById: (checkoutSessionId: string) => Promise<CheckoutSession> = async (checkoutSessionId: string) => {
        const params = {
            TableName: DDB_CHECKOUT_SESSION_TABLE_NAME,
            KeyConditionExpression: "sessionId = :csid",
            ExpressionAttributeValues: {
                ":csid": { S: checkoutSessionId }
            },
            ScanIndexForward: false,
            Limit: 1,
        };

        const command = new QueryCommand(params);

        try {
            const data = await DDB_CLIENT.send(command);

            if (!data.Items || data.Items.length === 0) {
                throw new Error("Checkout session not found");
            }

            const item = unmarshall(data.Items[0]);

            return item as CheckoutSession
        } catch (err) {
            console.error("Error getting latest checkout session:", err);
            throw err;
        }
    }
    confirmPaymentForCheckoutSession: (checkoutSessionId: string, checkoutTimestamp: number) => Promise<void> = async (checkoutSessionId, checkoutTimestamp) => {
        const params = {
            TableName: DDB_CHECKOUT_SESSION_TABLE_NAME,
            Key: {
                sessionId: { S: checkoutSessionId },
                checkoutTimestamp: { N: checkoutTimestamp.toString() }
            },
            UpdateExpression: "SET #status = :completed",
            ExpressionAttributeNames: {
                "#status": "status"
            },
            ExpressionAttributeValues: {
                ":completed": { S: CheckoutSessionStatus.COMPLETED }
            },
        };

        const command = new UpdateItemCommand(params);

        try {
            await DDB_CLIENT.send(command);
        } catch (err) {
            console.error("Error confirming payment for checkout session:", err);
            throw err;
        }
    }
    addTransaction = async (userId: string, transaction: Transaction): Promise<void> => {
        const dataType = `${UserTableDataType.TRANSACTION}#${transaction.transactionTimestamp}`;

        const currentBalance = await this.getUserBalance(userId);

        const newBalance = currentBalance + transaction.amount;

        const transactionParams = {
            TableName: DDB_USERS_TABLE_NAME,
            Item: {
                userId: { S: userId },
                "dataType": { S: dataType },
                amount: { N: transaction.amount.toString() },
                transactionTimestamp: { N: transaction.transactionTimestamp.toString() },
                description: { S: transaction.description },
                balance: { N: newBalance.toString() },
            },
        };

        const transactionCommand = new PutItemCommand(transactionParams);

        try {
            await DDB_CLIENT.send(transactionCommand);
        } catch (err) {
            console.error("Error adding transaction:", err);
            throw err;
        }
    }
    getUserBalance = async (userId: string): Promise<number> => {
        const queryParams = {
            TableName: DDB_USERS_TABLE_NAME,
            KeyConditionExpression: "userId = :userId AND begins_with(dataType, :dataTypePrefix)",
            ExpressionAttributeValues: {
                ":userId": { S: userId },
                ":dataTypePrefix": { S: `${UserTableDataType.TRANSACTION}#` },
            },
            ScanIndexForward: false,
            Limit: 1,
            ProjectionExpression: "balance",
        };

        const queryCommand = new QueryCommand(queryParams);

        try {
            const response = await DDB_CLIENT.send(queryCommand);
            const items = response.Items;

            if (!items?.length) {
                return 0;
            }

            const latestTransactionItem = items[0];
            const balance = latestTransactionItem.balance.N ? parseFloat(latestTransactionItem.balance.N) : 0;

            return balance;
        } catch (err) {
            console.error("Error getting user balance:", err);
            return 0;
        }
    }

    getUserTransactions = async (userId: string): Promise<Transaction[]> => {
        const queryParams = {
            TableName: DDB_USERS_TABLE_NAME,
            KeyConditionExpression: "userId = :userId AND begins_with(dataType, :dataTypePrefix)",
            ExpressionAttributeValues: {
                ":userId": { S: userId },
                ":dataTypePrefix": { S: `${UserTableDataType.TRANSACTION}#` },
            },
            ScanIndexForward: false,
            ProjectionExpression: "amount, transactionTimestamp, description",
        };

        const queryCommand = new QueryCommand(queryParams);

        try {
            const response = await DDB_CLIENT.send(queryCommand);
            const items = response.Items;

            if (!items?.length) {
                return [];
            }

            const transactions: Transaction[] = items.map((item) => ({
                amount: item.amount.N ? parseFloat(item.amount.N) : 0,
                transactionTimestamp: item.transactionTimestamp.N ? parseFloat(item.transactionTimestamp.N) : 0,
                description: item.description.S || "",
                promptId: item.promptId?.S || "",
            }));

            return transactions;
        } catch (err) {
            console.error("Error getting user transactions:", err);
            return [];
        }
    }

    createUserIfNotExistent: (userId: string) => Promise<void> = async (userId) => {
        const isExistingUser = await this.isExistingUser(userId)
        if (!isExistingUser) {
            await this.createNewUser({ userId: userId })
            await this.addTransaction(userId, { amount: FREE_CREDITS_CENTS, transactionTimestamp: Date.now(), description: "Free Credits" })
        }
    }
    isExistingUser = async (userId: UserId) => {
        const commandProps = {
            TableName: DDB_USERS_TABLE_NAME,
            Key: {
                userId: { S: userId },
                dataType: { S: `${UserTableDataType.METADATA}` }
            },
        };
        const getItemCommand = new GetItemCommand(commandProps);

        try {
            const getItemResponse = await DDB_CLIENT.send(getItemCommand);

            return !!getItemResponse.Item
        } catch (err) {
            console.error("Error getting item from DynamoDB:", err);
        }

        return false
    }




    createNewUser = async (userInput: UserInput) => {
        const commandProps: PutItemCommandInput = {
            TableName: DDB_USERS_TABLE_NAME,
            Item: {
                userId: { S: userInput.userId },
                'dataType': { S: `${UserTableDataType.METADATA}` }
            },
        };

        const putItemCommand = new PutItemCommand(commandProps);

        try {
            const putItemResponse = await DDB_CLIENT.send(putItemCommand);
        } catch (err) {
            console.error("Error creating user in DynamoDB:", err);
        }
    }

}