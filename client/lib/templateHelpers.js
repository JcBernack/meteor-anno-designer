Template.registerHelper("formatDate", function(date) {
  return date && date.toLocaleDateString();
});

Template.registerHelper("getUsername", function(userId) {
  var user = Meteor.users.findOne(userId);
  return user ? user.username : "unknown";
});

Template.registerHelper("equalsCurrentUser", function(userId) {
  return userId === Meteor.userId();
});
