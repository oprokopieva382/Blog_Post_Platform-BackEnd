import { LikeDetailsDBType } from "../cloud_DB/mongo_db_types";

export const sortLikes = (postLikes: any): LikeDetailsDBType[] => {
  let latestReactions: LikeDetailsDBType[] = postLikes.flatMap(
    (postLike: any) => postLike.latestReactions
  );
  
console.log("latestReactions before sort", latestReactions);

  const afterSort =  latestReactions
    .sort(
      (a: any, b: any) =>
        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
    )
    .slice(-3);

    console.log("latestReactions after sort", afterSort);

    return afterSort
};
