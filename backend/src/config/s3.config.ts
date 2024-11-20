import { S3Client } from "@aws-sdk/client-s3";
import "dotenv/config";

const accessKeyId = process.env.AWS_S3_ACCESS_KEY_ID || "demoaccesskey";
const secretAccessKey =
  process.env.AWS_S3_SECRET_ACCESS_KE || "demosecretaccesskey";

export const s3Client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});
