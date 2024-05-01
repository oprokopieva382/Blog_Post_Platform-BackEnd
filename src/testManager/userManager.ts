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
        id: Math.random(),
        createdAt: new Date(),
        ...u,
      })),
    };
    return paginatorUserView;
  },
};
