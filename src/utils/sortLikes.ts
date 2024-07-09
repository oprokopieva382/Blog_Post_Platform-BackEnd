import { LikeDetailsDBType } from "../cloud_DB/mongo_db_types";

export const sortLikes = (postLikes: any): LikeDetailsDBType[] => {
  let latestReactions: LikeDetailsDBType[] = postLikes.flatMap(
    (postLike: any) => postLike.latestReactions
  );

  const afterSort = latestReactions
    .sort(
      (a: any, b: any) =>
        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    )
    .slice(0, 3);

  return afterSort;
};
