import { GetItemCommand, PutItemCommand, QueryCommand, QueryCommandInput, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb"
import { PromptModel } from "@/app/api/Model/Prompt"
import { DDB_CLIENT, DDB_PROMPTS_CATEGORIES_TABLE_NAME, DDB_PROMPTS_TABLE_NAME } from "@/app/api/constants"
import { v4 as uuidv4 } from 'uuid';

export type PromptId = string

export abstract class PromptsRepository {
    abstract getPromptById: (id: PromptId) => Promise<PromptModel | undefined>
    abstract addPrompt: (prompt: PromptModel) => Promise<void>
    abstract addCategoryToPrompt: (id: PromptId, category: string) => Promise<void>
    abstract getPrompts: (limit: number) => Promise<PromptModel[]>
    abstract getNewId: () => Promise<PromptId>
    abstract getPromptCategories: (id: PromptId) => Promise<string[]>
    abstract getPromptsByCategory: (category: string) => Promise<PromptModel[]>
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
    ], [], uuidv4(), "Matteo"
)

export class LocalPromptsRepository extends PromptsRepository {
    getPromptsByCategory: (category: string) => Promise<PromptModel[]> = async (category) => {
        return this.prompts.filter(p => !p.categories.includes(category)) || []
    }
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
    getPrompts: (limit: number) => Promise<PromptModel[]> = async (limit) => {
        return this.prompts.slice(0, limit)
    }

}

export class DDBPromptsRepository extends PromptsRepository {
    getPromptsByCategory: (category: string) => Promise<PromptModel[]> = async (category) => {
        const queryParams: QueryCommandInput = {
            TableName: DDB_PROMPTS_CATEGORIES_TABLE_NAME,
            KeyConditionExpression: "category = :categoryValue",
            ExpressionAttributeValues: {
                ":categoryValue": { S: category }
            }
        };

        const queryCommand = new QueryCommand(queryParams);
        // TODO clean this shit
        try {
            const response = await DDB_CLIENT.send(queryCommand);

            const ddbCategoryItems = response.Items;

            const ddbDataItemsPromises = ddbCategoryItems?.map(async categoryItem => {
                if (!categoryItem.promptId?.S) {
                    throw new Error("Could not find id in prompt")
                }
                const prompt = await this.getPromptById(categoryItem.promptId.S)

                return prompt
            }) || []

            const ddbDataItems = await Promise.all(ddbDataItemsPromises)

            return ddbDataItems
        } catch (err) {
            console.error("Error getting prompts by category:", err);
            return [];
        }
    };

    getPromptCategories: (id: PromptId) => Promise<string[]> = async (id) => {
        const params: QueryCommandInput = {
            TableName: DDB_PROMPTS_CATEGORIES_TABLE_NAME,
            IndexName: "PromptIdIndex",
            KeyConditionExpression: "promptId = :idValue",
            ExpressionAttributeValues: {
                ":idValue": { S: id },
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
        const putItemParams = {
            TableName: DDB_PROMPTS_CATEGORIES_TABLE_NAME,
            Item: {
                promptId: { S: id },
                category: { S: category },
            },
        };

        const putItemCommand = new PutItemCommand(putItemParams);

        try {
            const response = await DDB_CLIENT.send(putItemCommand);
        } catch (err) {
            console.error("Error adding category to prompt to DynamoDB:", err);
        }
    };
    getNewId: () => Promise<PromptId> = async () => {
        return uuidv4()
    };
    getPromptById: (promptId: PromptId) => Promise<PromptModel> = async (promptId) => {
        const queryParams = {
            TableName: DDB_PROMPTS_TABLE_NAME,
            KeyConditionExpression: "id = :promptId",
            ExpressionAttributeValues: {
                ":promptId": { S: promptId },
            },
        };

        const queryCommand = new QueryCommand(queryParams);

        try {
            const response = await DDB_CLIENT.send(queryCommand);
            const items = response.Items;

            if (!items?.length) {
                throw new Error("Prompt not found");
            }

            const item = items[0];
            const categories = await this.getPromptCategories(promptId);
            const promptModel = this.ddbToPromptModel(item, categories);

            return promptModel;
        } catch (err) {
            console.error("Error getting prompt from DynamoDB:", err);
            throw err;
        }
    }
    addPrompt: (inputPrompt: PromptModel) => Promise<void> = async (inputPrompt) => {
        const putItemParams = {
            TableName: DDB_PROMPTS_TABLE_NAME,
            Item: {
                id: { S: inputPrompt.id },
                "creator#TS": { S: `${inputPrompt.userCreatorId}#${Date.now()}` },
                title: { S: inputPrompt.title },
                description: { S: inputPrompt.description },
                userTextFields: { S: JSON.stringify(inputPrompt.userTextFields) },
                img: { S: inputPrompt.img },
                promptTexts: { S: JSON.stringify(inputPrompt.promptTexts) },
                userCreatorId: { S: inputPrompt.userCreatorId },
            },
        };

        const putItemCommand = new PutItemCommand(putItemParams);

        try {
            const response = await DDB_CLIENT.send(putItemCommand);
        } catch (err) {
            console.error("Error adding prompt to DynamoDB:", err);
        }
    }


    getPrompts: (limit: number) => Promise<PromptModel[]> = async (limit) => {
        const scanParams = {
            TableName: DDB_PROMPTS_TABLE_NAME,
            Limit: limit,
            ScanIndexForward: false,
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
        const userCreatorId = promptDataObject.userCreatorId.S

        const promptModel = new PromptModel(title, description, userTextFields, img, promptTexts, promptCategoriesObjects, id, userCreatorId)
        return promptModel
    }

}
