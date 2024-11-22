declare interface Error {
  status?: number;
  message?: string;
}

declare interface S3File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  bucket: string;
  key: string;
  acl: string;
  contentType: string;
  location: string;
  etag: string;
}

declare namespace Express {
  export interface Request {
    user: {
      id: string;
      role: string;
    };
  }
}
