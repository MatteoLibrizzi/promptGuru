import { AttributeValue, PutItemCommand } from "@aws-sdk/client-dynamodb"
import { DDB_CLIENT, DDB_PROMPTS_TABLE_NAME } from "../constants"


export async function GET(request: Request) {

    // const command = new PutItemCommand({
    //     TableName: DDB_PROMPTS_TABLE_NAME,
    //     Item: {
    //         id: { N: '0' },
    //     }
    // })

    // DDB_CLIENT.send(command)

    return Response.json({})
}
