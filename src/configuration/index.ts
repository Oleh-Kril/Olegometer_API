import {config} from "dotenv"

config()
export const DATA_BASE_CONFIGURATION = {
  mongoConnectionString: process.env.MONGODB_URI as string,
};
