import { config } from "dotenv";
//imports values from .env file in process.env
config();

export const SETTINGS = {
  //for updating comforts here all hardcoded values
  PORT: process.env.PORT || 3004,
  MONGO_DB_ATLAS: process.env.MONGO_DB_ATLAS || "",
  DB_NAME: process.env.DB_NAME,
  BLOGS_COLLECTION: process.env.BLOGS_COLLECTION || "",
  POSTS_COLLECTION: process.env.POSTS_COLLECTION || "",
  USERS_COLLECTION: process.env.USERS_COLLECTION || "",
  COMMENTS_COLLECTION: process.env.COMMENTS_COLLECTION || "",
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET || "123bga",
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET || "123456ab",
  REGISTRATION_EMAIL: process.env.REGISTRATION_EMAIL || "",
  REGISTRATION_PASS: process.env.REGISTRATION_PASS || "",
  ADMIN_AUTH: "admin:qwerty",
  PATH: {
    TESTING: "/testing",
    POSTS: "/posts",
    BLOGS: "/blogs",
    USERS: "/users",
    COMMENTS: "/comments",
    AUTH: "/auth",
  },
};
