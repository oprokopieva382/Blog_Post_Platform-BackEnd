export type DBType = {
  //videos: any[];
  posts: any[],
  blogs: any[]
};

export const db: DBType = {
  //videos: [],
  posts: [],
  blogs: []
};

export const setDB = (dataset?: Partial<DBType>) => {
  if (!dataset) {
    //db.videos = [];
    db.posts = []
    db.blogs = [];
    return;
  }

  //db.videos = dataset.videos || db.videos
  db.posts = dataset.posts || db.posts;
  db.blogs = dataset.blogs || db.blogs;

};
