import { GetItemCommand, PutItemCommand, QueryCommand, ScanCommand } from "@aws-sdk/client-dynamodb"
import { PromptModel } from "../Model/Prompt"
import { DDB_CLIENT, DDB_PROMPTS_TABLE_NAME } from "../constants"

export type PromptId = number

export abstract class PromptsRepository {
    abstract getPromptById: (id: PromptId) => Promise<PromptModel | undefined>
    abstract addPrompt: (prompt: PromptModel) => Promise<void>
    abstract getRecentPrompts: (limit: number) => Promise<PromptModel[]>
    abstract getNextId: () => Promise<number>
}

const PROMPT = new PromptModel(
    "CV Updater", "testPrompt",
    [
        { name: "Curriculum Markdown", description: "DescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescrDescr" },
        { name: "Job description", description: "Descr" },

    ], "",
    [
        "You are an expect in Job Hunting and carreer development. You have to help a candidate modify his curriculum for a specific position. Given the following Curriculum, modify it to fit the job description that will be provided after. Here is the curriculum in markdown format:\n",
        "\nAnd here is the job description:\n",
        "\nProvide the modified curriculum in markdown format"
    ], 0
)

export class LocalPromptsRepository extends PromptsRepository {
    getNextId: () => Promise<number> = async () => {
        return this.id++
    }
    prompts: PromptModel[]
    id: PromptId
    constructor() {
        super()
        this.prompts = [PROMPT]
        this.id = 1
    }
    getPromptById: (id: PromptId) => Promise<PromptModel | undefined> = async (id) => {
        return this.prompts.find(p => p.id === id)
    }
    addPrompt: (prompt: PromptModel) => Promise<void> = async (prompt) => {
        this.prompts.push({ ...prompt, id: this.id++ })
    }
    getRecentPrompts: (limit: number) => Promise<PromptModel[]> = async (limit) => {
        return this.prompts.slice(0, limit)
    }

}

// TODO use another ddb table to search by category
// pk prompt id, sk category
export class DDBPromptsRepository extends PromptsRepository {
    getNextId: () => Promise<number> = async () => {
        const scanParams = {
            TableName: DDB_PROMPTS_TABLE_NAME,
            ProjectionExpression: "id",
            FilterExpression: "attribute_exists(id)",
            ScanIndexForward: false,
            Limit: 1,
        };

        const scanCommand = new ScanCommand(scanParams);

        try {
            const response = await DDB_CLIENT.send(scanCommand);
            if (response.Items && response.Items.length > 0) {
                const maxId = response.Items[0].id.N || '0'
                return parseInt(maxId, 10) + 1;
            } else {
                return 0;
            }
        } catch (err) {
            console.error("Error getting maximum id:", err);

        }
        return 0;
    }
    getPromptById: (id: PromptId) => Promise<PromptModel | undefined> = async (id) => {
        const commandProps = {
            TableName: DDB_PROMPTS_TABLE_NAME,
            Key: {
                id: { N: id.toString() },
            },
        }
        const command = new GetItemCommand(commandProps);

        try {
            const response = await DDB_CLIENT.send(command);

            if (!response.Item) {
                return undefined
            }

            const promptModel = this.ddbToPromptModel(response.Item)

            return promptModel
        } catch (err) {
            console.error("Error getting item from DynamoDB:", err);
        }
        return undefined
    }
    addPrompt: (inputPrompt: PromptModel) => Promise<void> = async (inputPrompt) => {
        const id = await this.getNextId()
        const putItemParams = {
            TableName: DDB_PROMPTS_TABLE_NAME,
            Item: {
                id: { N: id.toString() },
                title: { S: inputPrompt.title },
                description: { S: inputPrompt.description },
                userTextFields: { S: JSON.stringify(inputPrompt.userTextFields) },
                img: { S: inputPrompt.img },
                promptTexts: { S: JSON.stringify(inputPrompt.promptTexts) }
            },
        };

        const putItemCommand = new PutItemCommand(putItemParams);

        try {
            const response = await DDB_CLIENT.send(putItemCommand);
            console.log("Prompt added successfully:", response.$metadata.httpStatusCode);
        } catch (err) {
            console.error("Error adding prompt to DynamoDB:", err);
        }
    }

    getRecentPrompts: (limit: number) => Promise<PromptModel[]> = async (limit) => {
        const queryParams = {
            TableName: DDB_PROMPTS_TABLE_NAME,
            Limit: limit,
            ScanIndexForward: false,
        };

        const queryCommand = new ScanCommand(queryParams);

        try {
            const response = await DDB_CLIENT.send(queryCommand);

            const ddbItems = response.Items

            if (!ddbItems) {
                throw new Error("No items found")
            }

            console.log("DDB Items", ddbItems)

            const promptModelItems = (ddbItems.map((ddbItem) => this.ddbToPromptModel(ddbItem)))

            console.log("prompt model items", promptModelItems)
            return promptModelItems
        } catch (err) {
            console.error("Error getting recent prompts:", err);
            return [];
        }
    }

    ddbToPromptModel = (ddbObject: any) => {
        const title = ddbObject.title.S
        const description = ddbObject.description.S
        const userTextFields = JSON.parse(ddbObject.userTextFields.S)
        const img = ddbObject.img.S
        const promptTexts = JSON.parse(ddbObject.promptTexts.S)
        const id = ddbObject.id.N

        const promptModel = new PromptModel(title, description, userTextFields, img, promptTexts, id)
        return promptModel
    }

}
