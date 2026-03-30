export type Config = {
  app: AppConfig;
  db: DBConfig;
  token: TokenConfig;
  jobs: JobsConfig;
  external: ExternalConfig;
  email: EmailConfig;
  // aws: AWSConfig;
};

export type AppConfig = {
  host: string;
  port: number;
};

export type DBConfig = {
  uri: string;
};

export type TokenConfig = {
  accessToken: string;
  accessTokenExp: string;
  refreshToken: string;
  refreshTokenExp: string;
};

export type JobsConfig = {
  priceRecalcCron: string;
};

export type ExternalConfig = {
  privatApiUrl: string;
};

export type EmailConfig = {
  emailFrom: string;
  emailToken: string;
};

// export type AWSConfig = {
//   s3BucketName: string;
//   accessKey: string;
//   secretKey: string;
//   region: string;
//   s3ACL: ObjectCannedACL;
//   s3Endpoint: string;
// };
