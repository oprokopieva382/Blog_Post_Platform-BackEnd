import { BlogViewModel } from "../src/models/BlogViewModel";

export const blog1: BlogViewModel = {
  id: Math.floor(Date.now() + Math.random() * 1000000).toString(),
  name: "Callback hell",
  description: "here is short description for blog of callback hell",
  websiteUrl:
    "https://www.geeksforgeeks.org/what-to-understand-callback-and-callback-hell-in-javascript/",
};

export const dataset1 = {
  blogs: [blog1],
};
