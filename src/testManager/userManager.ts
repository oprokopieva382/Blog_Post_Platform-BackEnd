import { v1 as uuidv1 } from "uuid";

export const userManager = {
  async createUser() {
    const newUser = {
      login: "testUser",
      password: "string",
      email: "test@gmail.com",
    };
    return newUser;
  },

  async createUsers(count: number) {
    let users = [];
    for (let i = 0; i < count; i++) {
      const newUser = {
        login: "testUser" + i,
        password: "string" + i,
        email: `${i}test@gmail.com`,
      };
      users.push(newUser);
    }
    return users;
  },

  async createObjectWithPaginationAndUsers(
    pageNumber: number = 1,
    pageSize: number = 10
  ) {
    const users = await this.createUsers(20);
    const totalUsersCount = users.length;

    const paginatorUserView = {
      pagesCount: Math.ceil(totalUsersCount / pageSize),
      page: pageNumber,
      pageSize,
      totalCount: totalUsersCount,
      items: users.map((u) => ({
        id: "662bb47c5ea36539e79c72" + Math.ceil(Math.random() * 23),
        createdAt: new Date(),
        ...u,
      })),
    };
    return paginatorUserView;
  },

  async getUser() {
    const user = await this.createUser();
    const userToView = {
      id: "662bb47c5ea36539e79c77" + Math.ceil(Math.random() * 23),
      email: "user02",
      login: "email1p@gg.com",
      createdAt: "2024-04-26T14:04:43.690Z",
    };
    return userToView;
  },
};
