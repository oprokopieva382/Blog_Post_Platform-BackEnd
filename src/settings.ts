import {config} from "dotenv"
//imports values from .env file in process.env
config()

export const SETTINGS = {
  //for updating comforts here all hardcoded values
  PORT: process.env.PORT || 3003,
  PATH: {
    VIDEOS: "/videos",
  },
};