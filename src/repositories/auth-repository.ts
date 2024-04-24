import { UserDBType} from "../cloud_DB";
import { usersCollection } from "../cloud_DB/mongo_db_atlas";

export const authRepository = {
  async getByLoginOrEmail(data: string): Promise<UserDBType | null> {
    const foundUser = await usersCollection.findOne({
      $or: [{ email: data }, { login: data }],
    });
    return foundUser;
  },
}