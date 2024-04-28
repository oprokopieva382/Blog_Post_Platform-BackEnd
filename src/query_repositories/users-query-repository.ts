import { UserDBType } from "../cloud_DB";
import { Paginator, UserViewModel } from "../models";
import { QueryUserType } from "../query-type";
import { usersCollection } from "../cloud_DB/mongo_db_atlas";
import { ObjectId } from "mongodb";

export const usersQueryRepository = {
  async getAllUsers(query: QueryUserType): Promise<Paginator<UserViewModel>> {
    const searchByLogin = query.searchLoginTerm
      ? { login: { $regex: query.searchLoginTerm, $options: "i" } }
      : {};

    const searchByEmail = query.searchEmailTerm
      ? { email: { $regex: query.searchEmailTerm, $options: "i" } }
      : {};

    const totalUsersCount = await usersCollection.countDocuments({
      $or: [{ ...searchByLogin }, { ...searchByEmail }],
    });

    const users: UserDBType[] = await usersCollection
      .find({ $or: [{ ...searchByLogin }, { ...searchByEmail }] })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .sort(query.sortBy, query.sortDirection)
      .toArray();

    const usersToView = {
      pagesCount: Math.ceil(totalUsersCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalUsersCount,
      items: users.map((u) => this._mapUsersToView(u)),
    };

    return usersToView;
  },

  async getByIdUser(id: string): Promise<UserViewModel | null> {
    const foundUser = await usersCollection.findOne({
      _id: new ObjectId(id),
    });
    return foundUser ? this._mapUsersToView(foundUser) : null;
  },

  _mapUsersToView(user: UserDBType): UserViewModel {
    return {
      // Convert ObjectId to string
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  },
};
