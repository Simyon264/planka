module.exports = {
  async fn() {
    const users = await sails.helpers.users.getMany();
    const { currentUser } = this.req;

    users.forEach((user) => {
      if (!currentUser.isAdmin && currentUser.id !== user.id) {
        delete user.email;
      }
    });

    return {
      items: users,
    };
  },
};
