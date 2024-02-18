import {config} from "dotenv"

config()
export const DATA_BASE_CONFIGURATION = {
  mongoConnectionString: process.env.MONGODB_URI as string,
};

export const FILE_STORAGE_CONFIGURATION = {
  s3AccessKeyId: process.env.S3_ACCESS_KEY_ID as string,
  s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
  s3Region: process.env.S3_REGION as string,
};
