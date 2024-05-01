export const userManager = {
 async createUser() {
    const newUser = {
      login: "testUser",
      password: "string",
      email: "test@gmail.com",
    };
    return newUser;
  },

 async  createUsers(count: number) {
    let users = [];
    for (let i = 0; i < count; i++) {
      const newUser = {
        login: "testUser" + i,
        password: "string" + i,
        email: `${i}test@gmail.com`,
      };
      users.push(newUser);
    }
    return users
  },
};
