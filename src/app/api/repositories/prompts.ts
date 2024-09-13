import { GetItemCommand, PutItemCommand, QueryCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb"
import { PromptModel } from "@/app/api/Model/Prompt"
import { DDB_CLIENT, DDB_PROMPTS_TABLE_NAME } from "@/app/api/constants"
import { v4 as uuidv4 } from 'uuid';

export type PromptId = string

export abstract class PromptsRepository {
    abstract getPromptById: (id: PromptId) => Promise<PromptModel | undefined>
    abstract addPrompt: (prompt: PromptModel) => Promise<void>
    abstract addCategoryToPrompt: (id: PromptId, category: string) => Promise<void>
    abstract getRecentPrompts: (limit: number) => Promise<PromptModel[]>
    abstract getNewId: () => Promise<PromptId>
    abstract getPromptCategories: (id: PromptId) => Promise<string[]>
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
    ], [], uuidv4()
)

export class LocalPromptsRepository extends PromptsRepository {
    getPromptCategories: (id: PromptId) => Promise<string[]> = async (id) => {
        return this.prompts.find(p => p.id === id)?.categories || []
    }

    prompts: PromptModel[]
    id: PromptId
    constructor() {
        super()
        this.prompts = [PROMPT]
        this.id = uuidv4()
    }
    getNewId: () => Promise<PromptId> = async () => {
        return uuidv4()
    }
    getPromptById: (id: PromptId) => Promise<PromptModel | undefined> = async (id) => {
        return this.prompts.find(p => p.id === id)
    }
    addPrompt: (prompt: PromptModel) => Promise<void> = async (prompt) => {
        const assignedId = this.id
        this.prompts.push({ ...prompt, id: assignedId })
        this.id = await this.getNewId()
    }
    addCategoryToPrompt: (id: PromptId, category: string) => Promise<void> = async (id, category) => {
        const prompt = this.prompts.find(p => p.id === id)
        prompt?.categories.push(category)
    }
    getRecentPrompts: (limit: number) => Promise<PromptModel[]> = async (limit) => {
        return this.prompts.slice(0, limit)
    }

}

enum DataType {
    PROMPT_CATEGORY = "PROMPT_CATEGORY",
    PROMPT_DATA = "PROMPT_DATA"
}
export class DDBPromptsRepository extends PromptsRepository {

    getPromptCategories: (id: PromptId) => Promise<string[]> = async (id) => {
        const params = {
            TableName: DDB_PROMPTS_TABLE_NAME,
            KeyConditionExpression: "id = :idValue AND begins_with(dataType, :dataTypePrefix)",
            ExpressionAttributeValues: {
                ":idValue": { S: id },
                ":dataTypePrefix": { S: `${DataType.PROMPT_CATEGORY}#` },
            },
            ProjectionExpression: "category",
        };

        const queryCommand = new QueryCommand(params);

        try {
            const response = await DDB_CLIENT.send(queryCommand);
            const categories: string[] = response.Items?.map((item) => item?.category?.S || "") || [];
            return categories;
        } catch (err) {
            console.error("Error retrieving prompt categories:", err);
            return [];
        }
    };
    addCategoryToPrompt: (id: PromptId, category: string) => Promise<void> = async (id, category) => {
        const uuid = uuidv4();
        const dataType = `${DataType.PROMPT_CATEGORY}#${uuid}`;

        const putItemParams = {
            TableName: DDB_PROMPTS_TABLE_NAME,
            Item: {
                id: { S: id },
                dataType: { S: dataType },
                category: { S: category },
            },
        };

        const putItemCommand = new PutItemCommand(putItemParams);

        try {
            const response = await DDB_CLIENT.send(putItemCommand);
        } catch (err) {
            console.error("Error adding prompt to DynamoDB:", err);
        }
    };
    getNewId: () => Promise<PromptId> = async () => {
        return uuidv4()
    };
    getPromptById: (id: PromptId) => Promise<PromptModel | undefined> = async (id) => {
        const promptDataCommandProps = {
            TableName: DDB_PROMPTS_TABLE_NAME,
            Key: {
                id: { S: id },
                dataType: { S: DataType.PROMPT_DATA }
            },
        }
        const promptDataCommand = new GetItemCommand(promptDataCommandProps);

        try {
            const response = await DDB_CLIENT.send(promptDataCommand);
            const categories = await this.getPromptCategories(id)

            if (!response.Item) {
                return undefined
            }

            const promptModel = this.ddbToPromptModel(response.Item, categories)

            return promptModel
        } catch (err) {
            console.error("Error getting item from DynamoDB:", err);
        }
        return undefined
    }
    addPrompt: (inputPrompt: PromptModel) => Promise<void> = async (inputPrompt) => {
        const putItemParams = {
            TableName: DDB_PROMPTS_TABLE_NAME,
            Item: {
                id: { S: inputPrompt.id },
                dataType: { S: DataType.PROMPT_DATA },
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
        } catch (err) {
            console.error("Error adding prompt to DynamoDB:", err);
        }
    }


    getRecentPrompts: (limit: number) => Promise<PromptModel[]> = async (limit) => {
        const scanParams = {
            TableName: DDB_PROMPTS_TABLE_NAME,
            Limit: limit,
            ScanIndexForward: false,
            FilterExpression: 'begins_with(dataType, :dataTypePrefix)',
            ExpressionAttributeValues: {
                ':dataTypePrefix': { S: `${DataType.PROMPT_DATA}` },
            },
        };

        const scanCommand = new ScanCommand(scanParams);

        try {
            const response = await DDB_CLIENT.send(scanCommand);

            const ddbItems = response.Items;

            const categoriesGroupedByPromptId: Record<string, string[]> = {}
            const categoriesPromises = ddbItems?.map(async (item) => {
                const id = item.id?.S;
                if (!id) {
                    throw new Error("Missing ID in prompt")
                }
                const categories = await this.getPromptCategories(id);
                return { id, categories };
            }) || [];

            const categoriesResults = await Promise.all(categoriesPromises);

            categoriesResults.forEach(({ id, categories }: any) => {
                if (id && categories) {
                    categoriesGroupedByPromptId[id] = categories;
                }
            });

            if (!ddbItems) {
                throw new Error("No items found");
            }

            const promptModelItems = ddbItems.map((ddbItem) => {
                if (!ddbItem.id?.S) {
                    throw new Error("Missing ID in prompt")
                }
                return this.ddbToPromptModel(ddbItem, categoriesGroupedByPromptId[ddbItem.id.S])
            });

            return promptModelItems;
        } catch (err) {
            console.error("Error getting recent prompts:", err);
            return [];
        }
    };

    ddbToPromptModel = (promptDataObject: any, promptCategoriesObjects: string[]) => {
        const title = promptDataObject.title.S
        const description = promptDataObject.description.S
        const userTextFields = JSON.parse(promptDataObject.userTextFields.S)
        const img = promptDataObject.img.S
        const promptTexts = JSON.parse(promptDataObject.promptTexts.S)
        const id = promptDataObject.id.S

        const promptModel = new PromptModel(title, description, userTextFields, img, promptTexts, promptCategoriesObjects, id)
        return promptModel
    }

    getNextCategoryIndex = async (id: PromptId): Promise<number> => {
        const params = {
            TableName: DDB_PROMPTS_TABLE_NAME,
            KeyConditionExpression: "id = :id AND begins_with(dataType, :skPrefix)",
            ExpressionAttributeValues: {
                ":id": { S: id },
                ":skPrefix": { S: `${DataType.PROMPT_CATEGORY}#` },
            },
            ProjectionExpression: "dataType",
            ScanIndexForward: true,
            Limit: 1,
        };

        const queryCommand = new QueryCommand(params);

        try {
            const response = await DDB_CLIENT.send(queryCommand);
            const items = response.Items;

            if (items && items.length > 0) {
                const lastSk = items[0].dataType.S;
                if (!lastSk) {
                    return 1
                }
                const lastIndex = parseInt(lastSk.split("#")[1], 10);
                return lastIndex + 1;
            }
        } catch (err) {
            console.error("Error querying DynamoDB:", err);
        }

        return 1
    };

}
