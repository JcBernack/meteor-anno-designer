publishForRole("roles", "useradmin", function() {
  return Meteor.roles.find({})
});
