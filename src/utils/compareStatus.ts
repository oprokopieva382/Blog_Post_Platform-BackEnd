import { ObjectId } from "mongodb";
import { CommentModel } from "../models";
import { LikeStatus } from "../types/LikesStatus";

//const compareStatus = (myStatus: LikeStatus, likeStatus: LikeStatus) => {};

class compareStatus {
  constructor(
    protected likeStatus: LikeStatus,
    protected commentId: string,
    myStatus: LikeStatus
  ) {}

  async updateLinkCount(likeStatus: LikeStatus) {
    if (likeStatus === LikeStatus.Like) {
      return await CommentModel.findOneAndUpdate(
        { _id: new ObjectId(this.commentId) },
        {
          $inc: {
            "likesInfo.likesCount": 1,
          },
        },
        { new: true }
      );
    }

    if (likeStatus === LikeStatus.Dislike) {
      return await CommentModel.findOneAndUpdate(
        { _id: new ObjectId(this.commentId) },
        {
          $inc: {
            "likesInfo.dislikesCount": -1,
          },
        },
        { new: true }
      );
    }
  }
}

export { compareStatus };
