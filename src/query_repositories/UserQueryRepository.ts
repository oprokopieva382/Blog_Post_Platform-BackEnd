import { ObjectId } from "mongodb";
import { UserDBType } from "../cloud_DB";
import { Paginator, UserViewModel } from "../type-models";
import { QueryUserType } from "../types/query-type";
import { UserDTO } from "../DTO";
import { cache } from "../utils/decorators";
import { UserModel } from "../models";

class UserQueryRepository {
  async getAllUsers(query: QueryUserType): Promise<Paginator<UserViewModel>> {
    const searchByLogin = query.searchLoginTerm
      ? { login: { $regex: query.searchLoginTerm, $options: "i" } }
      : {};

    const searchByEmail = query.searchEmailTerm
      ? { email: { $regex: query.searchEmailTerm, $options: "i" } }
      : {};

    const totalUsersCount = await UserModel.countDocuments({
      $or: [{ ...searchByLogin }, { ...searchByEmail }],
    });

    const users: UserDBType[] = await UserModel.find({
      $or: [{ ...searchByLogin }, { ...searchByEmail }],
    })
      .skip((query.pageNumber - 1) * query.pageSize)
      .limit(query.pageSize)
      .sort({ [query.sortBy]: query.sortDirection })
      .lean();

    const usersToView = {
      pagesCount: Math.ceil(totalUsersCount / query.pageSize),
      page: query.pageNumber,
      pageSize: query.pageSize,
      totalCount: totalUsersCount,
      items: users.map((u) => UserDTO.transform(u)),
    };

    return usersToView;
  }

  @cache((userId: string) => `user:${userId}`)
  async getByIdUser(id: string): Promise<UserViewModel | null> {
    const result = await UserModel.findOne({
      _id: new ObjectId(id),
    });
    
    return result ? UserDTO.transform(result) : null;
  }
}

export const userQueryRepository = new UserQueryRepository();
