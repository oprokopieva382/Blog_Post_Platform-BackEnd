export type DBType = {
  videos: any[];
  //users
};

export const db: DBType = {
  videos: [],
  //users
};

export const setDB = (dataset?: Partial<DBType>) => {
  if (!dataset) {
    db.videos = [];
    //db.users
    return;
  }

  db.videos = dataset.videos || db.videos
  //db.users
};
