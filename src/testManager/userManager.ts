import request from "supertest";
import { SETTINGS } from "../settings";
import { app } from "../app";

export const userManager = {
  async createUser() {
    const newUser = {
      login: "testUser",
      password: "string",
      email: "test@gmail.com",
    };
    return newUser;
  },

  async usersWithPagination(pageNumber: number = 1, pageSize: number = 10) {
    const users = await this.getUsers();
    const totalUsersCount = users.length;
   
    const paginatorUserView = {
      pagesCount: Math.ceil(totalUsersCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: totalUsersCount,
      items: users.map((u: any) => ({
        id: u.id,
        login: u.login,
        email: u.email,
        createdAt: u.createdAt,
      })),
    };
    return paginatorUserView;
  },

  async getUsers() {
    const usersRequest = await request(app)
      .get(SETTINGS.PATH.USERS)
      .auth("admin", "qwerty")
      .expect(200);
    const users = usersRequest.body.items;

    return users;
  },
};
