import {config} from "dotenv"
//imports values from .env file in process.env
config()

export const SETTINGS = {
  //for updating comforts here all hardcoded values
  PORT: process.env.PORT || 3004,
  ADMIN_AUTH: "admin:qwerty",
  PATH: {
    VIDEOS: "/videos",
    TESTING: "/testing",
    POSTS: "/posts",
    BLOGS: "blogs",
  },
};