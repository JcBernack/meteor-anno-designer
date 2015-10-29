Meteor.users.allow({
  remove: allowInRole("useradmin")
});

Meteor.users.deny({
  // prevent a user from deleting itself
  remove: function(userId, doc) {
    return userId === doc._id;
  }
});

publishForRole("userdata", "useradmin", function() {
  return Meteor.users.find({}, { fields: { username: 1, roles: 1, emails: 1 } });
});

//TODO: add named publication and subscribe only when needed
Meteor.publish(null, function () {
  return Meteor.users.find({}, { fields: { username: 1 } });
});
