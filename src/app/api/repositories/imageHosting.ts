import { PutObjectCommand, } from "@aws-sdk/client-s3";
import { S3_CLIENT, S3_PROMPT_IMAGES_BUCKET_NAME } from "../constants";
import {
    getSignedUrl,
} from "@aws-sdk/s3-request-presigner";

export abstract class ImageHostingRepository {

    getUploadUrl: (promptId: string) => Promise<string> = () => Promise.reject("Not implemented");
}

export class S3ImageHostingRepository extends ImageHostingRepository {
    constructor() {
        super();
    }

    getUploadUrl: (promptId: string) => Promise<string> = async (promptId) => {
        const params = {
            Bucket: S3_PROMPT_IMAGES_BUCKET_NAME,
            Key: `promptsImages/${promptId}`,
        };

        const command = new PutObjectCommand(params);
        return await getSignedUrl(S3_CLIENT, command, { expiresIn: 3600 });
    }
}