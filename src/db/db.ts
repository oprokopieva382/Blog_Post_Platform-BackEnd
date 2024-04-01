export type DBType = {
  //videos: any[];
  posts: any[]
};

export const db: DBType = {
  //videos: [],
  posts: []
};

export const setDB = (dataset?: Partial<DBType>) => {
  if (!dataset) {
    //db.videos = [];
    db.posts = []
    return;
  }

  //db.videos = dataset.videos || db.videos
  db.posts = dataset.posts || db.posts;

};
