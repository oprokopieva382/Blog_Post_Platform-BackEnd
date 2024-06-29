import { config } from "dotenv";
//imports values from .env file in process.env
config();

export const SETTINGS = {
  //for updating comforts here all hardcoded values
  PORT: process.env.PORT || 3004,
  TESTING_ENVIRONMENT_STATUS: process.env.TESTING_ENVIRONMENT_STATUS || "",
  STAGING_ENVIRONMENT_STATUS: process.env.STAGING_ENVIRONMENT_STATUS || "",
  MONGO_DB_ATLAS: process.env.MONGO_DB_ATLAS || "",
  MONGO_DB_COMPASS: process.env.MONGO_DB_COMPASS || "",
  DB_NAME: process.env.DB_NAME,
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET || "123bga",
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET || "123456ab",
  REGISTRATION_EMAIL: process.env.REGISTRATION_EMAIL || "",
  REGISTRATION_PASS: process.env.REGISTRATION_PASS || "",
  ADMIN_AUTH: "admin:qwerty",
  VERSION: process.env.VERSION || "",
  PATH: {
    TESTING: "/testing",
    POSTS: "/posts",
    BLOGS: "/blogs",
    USERS: "/users",
    COMMENTS: "/comments",
    AUTH: "/auth",
    SECURITY_DEVICES: "/security/devices",
  },
};
