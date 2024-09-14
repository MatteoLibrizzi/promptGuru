import { GetItemCommand, PutItemCommand, PutItemCommandInput, QueryCommand, QueryCommandInput } from "@aws-sdk/client-dynamodb"
import { DDB_CLIENT, DDB_USERS_TABLE_NAME, FREE_CREDITS_CENTS } from "@/app/api/constants"


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
}


export type UserId = string
export interface UserInput {
    userId: UserId
}

export class MockUsersRepository extends UsersRepository {
    addTransaction: (userId: string, transaction: Transaction) => Promise<void> = async () => { }
    getUserBalance: (userId: string) => Promise<number> = async () => 1
    getUserTransactions: (userId: string) => Promise<Transaction[]> = async () => []
    isExistingUser = async (userId: UserId) => true
    createNewUser = async (userInput: UserInput) => { }
    createUserIfNotExistent = async (userId: UserId) => { }
}

enum DataType {
    METADATA = "METADATA",
    TRANSACTION = "TRANSACTION",
};

export class DDBUsersRepository extends UsersRepository {
    addTransaction = async (userId: string, transaction: Transaction): Promise<void> => {
        const dataType = `${DataType.TRANSACTION}#${transaction.transactionTimestamp}`;

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
                ":dataTypePrefix": { S: `${DataType.TRANSACTION}#` },
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
                ":dataTypePrefix": { S: `${DataType.TRANSACTION}#` },
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
                dataType: { S: `${DataType.METADATA}` }
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
                'dataType': { S: `${DataType.METADATA}` }
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