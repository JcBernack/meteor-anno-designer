// add admin user if no user exists
if (Meteor.users.find().count() == 0) {
  var id = Accounts.createUser({ username: "admin", email: "admin@admin.com", password: "admin" });
  Roles.addUsersToRoles(id, "useradmin");
  console.log("created admin user: " + id);
}
