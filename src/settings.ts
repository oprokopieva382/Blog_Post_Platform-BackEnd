import { config } from "dotenv";
//imports values from .env file in process.env
config();

export const SETTINGS = {
  //for updating comforts here all hardcoded values
  PORT: process.env.PORT || 3004,
  MONGO_DB_ATLAS: process.env.MONGO_DB_ATLAS || "",
  DB_NAME: process.env.BLOG_NAME,
  BLOGS_COLLECTION: process.env.BLOGS_COLLECTION || "",
  POSTS_COLLECTION: process.env.POSTS_COLLECTION || "",
  USERS_COLLECTION: process.env.USERS_COLLECTION || "",
  ADMIN_AUTH: "admin:qwerty",
  PATH: {
    TESTING: "/testing",
    POSTS: "/posts",
    BLOGS: "/blogs",
    USERS: "/users",
    AUTH: "/auth"
  },
};
