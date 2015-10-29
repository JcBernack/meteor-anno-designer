Template.registerHelper("formatDate", function(date, alt) {
  return !date ? alt : date.toLocaleDateString();
});

Template.registerHelper("formatTime", function(date, alt) {
  return !date ? alt : date.toLocaleTimeString();
});

Template.registerHelper("formatDateTime", function(date, alt) {
  return !date ? alt : date.toLocaleDateString() + ", " + date.toLocaleTimeString();
});

Template.registerHelper("getUsername", function(userId) {
  var user = Meteor.users.findOne(userId);
  return user ? user.username : "unknown";
});

Template.registerHelper("equalsCurrentUser", function(userId) {
  return userId === Meteor.userId();
});

Template.registerHelper("fileSize", function(size) {
  var units = ["B", "KB", "MB", "GB", "TB"];
  var unit = 0;
  while (size >= 1024){
    size /= 1024;
    unit++;
  }
  return Math.round(size).toString() + " " + units[unit];
});
