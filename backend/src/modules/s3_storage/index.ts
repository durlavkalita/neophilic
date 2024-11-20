import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import multer from "multer";
import multerS3 from "multer-s3";
import { generateUniqueFileName } from "../../utils/helpers.js";
import { s3Client } from "../../config/s3.config.js";

export const getObjectUrl = async (filename: string) => {
  const command = new GetObjectCommand({
    Bucket: "neophilic-dev-1",
    Key: filename,
  });
  const url = await getSignedUrl(s3Client, command);
  console.log(url);

  return url;
};

export const putObject = async (filename: string, contentType: string) => {
  const command = new PutObjectCommand({
    Bucket: "neophilic-dev-1",
    Key: filename,
    ContentType: contentType,
  });
  const url = await getSignedUrl(s3Client, command);
  console.log(url);

  return url;
};

export const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: "neophilic-dev-1",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, generateUniqueFileName(file));
    },
  }),
});
