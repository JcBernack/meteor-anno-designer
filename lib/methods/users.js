Meteor.methods({
  "user.role.toggle": function (userId, role) {
    // validate arguments
    check(userId, String);
    check(role, String);
    // make sure the user is logged in and in the useradmin role
    access().from(this.userId).as("useradmin");
    // prevent the user from removing himself from the useradmin role
    if (userId === this.userId && role === "useradmin") {
      throw new Meteor.Error(400, "Bad Request", "You can not remove yourself from the useradmin role.");
    }
    // make sure the given user exists
    if (!Meteor.users.findOne(userId)) {
      throw new Meteor.Error(400, "Bad Request", "The given user does not exist.");
    }
    // prevent any role from being added which was not created on server startup
    if (!Meteor.roles.findOne({ name: role })) {
      throw new Meteor.Error(400, "Bad Request", "The given role does not exist.");
    }
    // toggle role for the given user
    if (Roles.userIsInRole(userId, role)) {
      Roles.removeUsersFromRoles(userId, role);
    } else {
      Roles.addUsersToRoles(userId, role);
    }
  }
});
