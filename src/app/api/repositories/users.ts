import { AttributeValue, GetItemCommand, PutItemCommand, PutItemCommandInput } from "@aws-sdk/client-dynamodb"
import { DDB_CLIENT, DDB_USERS_TABLE_NAME } from "../constants"

export abstract class UsersRepository {

    abstract getUserCredits: (userId: string) => Promise<number>
    abstract createNewUser: (userInput: UserInput) => Promise<void>
    abstract isExistingUser: (userId: string) => Promise<boolean>
}


export type UserId = string
export interface UserInput {
    userId: UserId, credits: number
}


export class DDBUsersRepository extends UsersRepository {
    isExistingUser = async (userId: UserId) => {
        const commandProps = {
            TableName: DDB_USERS_TABLE_NAME,
            Key: {
                userId: { S: userId },
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

    getUserCredits = async (userId: UserId) => {
        const userCreditsCommand = {

        }

        return 1
    }



    createNewUser = async (userInput: UserInput) => {
        const commandProps: PutItemCommandInput = {
            TableName: DDB_USERS_TABLE_NAME,
            Item: {
                userId: { S: userInput.userId },
                userCredits: { N: `${userInput.credits}` }
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