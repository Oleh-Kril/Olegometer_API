import {Injectable} from '@nestjs/common';
import {FILE_STORAGE_CONFIGURATION} from "../../../configuration";
import {S3Client, PutObjectCommand, GetObjectCommandOutput, GetObjectCommand} from '@aws-sdk/client-s3'

@Injectable()
export class FileStorageService{
    private readonly s3Client: S3Client;
    private readonly bucketName: string = 'olegometer.storage';
    constructor(
    ) {
        this.s3Client = new S3Client({
            credentials: {
                accessKeyId: FILE_STORAGE_CONFIGURATION.s3AccessKeyId,
                secretAccessKey: FILE_STORAGE_CONFIGURATION.s3SecretAccessKey,
            },
            region: FILE_STORAGE_CONFIGURATION.s3Region,
        });
    }

    async uploadFile(key: string, value: Buffer): Promise<void> {
        const params = {
            Bucket: this.bucketName,
            Key: key,
            Body: value,
        };

        try {
            const command = new PutObjectCommand(params);
            await this.s3Client.send(command);
        } catch (error) {
            throw new Error(`Error uploading file: ${error.message}`);
        }
    }

    async getFile(key: string): Promise<Buffer> {
        const params = {
            Bucket: this.bucketName,
            Key: key,
        };

        try {
            const command = new GetObjectCommand(params);
            const response: GetObjectCommandOutput = await this.s3Client.send(command);

            return new Promise<Buffer>((resolve, reject) => {
                const chunks: Uint8Array[] = [];
                (response.Body as any).on('data', (chunk: Uint8Array) => {
                    chunks.push(chunk);
                });

                (response.Body as any).on('end', () => {
                    resolve(Buffer.concat(chunks));
                });

                (response.Body as any).on('error', (err: Error) => {
                    reject(new Error(`Error getting file: ${err.message}`));
                });
            });

        } catch (error) {
            throw new Error(`Error getting file: ${error.message}`);
        }
    }
}
