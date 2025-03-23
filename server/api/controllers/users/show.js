const Errors = {
  USER_NOT_FOUND: {
    userNotFound: 'User not found',
  },
};

const CURRENT_USER_ID = 'me';

module.exports = {
  inputs: {
    id: {
      type: 'string',
      regex: /^[0-9]+|me$/,
      required: true,
    },
    subscribe: {
      type: 'boolean',
    },
  },

  exits: {
    boardNotFound: {
      responseType: 'notFound',
    },
  },

  async fn(inputs) {
    let user;
    if (inputs.id === CURRENT_USER_ID) {
      ({ currentUser: user } = this.req);

      if (inputs.subscribe && this.req.isSocket) {
        sails.sockets.join(this.req, `user:${user.id}`);
      }
    } else {
      user = await sails.helpers.users.getOne(inputs.id);
      // Patch: If the current user is not an admin and the requested user is not the current user, omit the email
      const { currentUser } = this.req;
      if (!currentUser.isAdmin && currentUser.id !== inputs.id) {
        delete user.email;
      }

      if (!user) {
        throw Errors.USER_NOT_FOUND;
      }
    }

    return {
      item: user,
    };
  },
};
