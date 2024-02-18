import {Injectable} from '@nestjs/common'
import {FILE_STORAGE_CONFIGURATION} from "../../../configuration"
import * as AWS from 'aws-sdk';

@Injectable()
export class FileStorageService{
    private readonly s3: AWS.S3;
    private readonly bucketName: string = 'olegometer.storage';
    constructor(
    ) {
        this.s3 = new AWS.S3({
            accessKeyId: FILE_STORAGE_CONFIGURATION.s3AccessKeyId,
            secretAccessKey: FILE_STORAGE_CONFIGURATION.s3SecretAccessKey,
            region: FILE_STORAGE_CONFIGURATION.s3Region,
        });
    }

    async uploadFile(key: string, value: Buffer): Promise<string> {
        const params: AWS.S3.PutObjectRequest = {
            Bucket: this.bucketName,
            Key: key,
            Body: value,
        };

        const result = await this.s3.upload(params).promise();
        return result.Location;
    }
}
