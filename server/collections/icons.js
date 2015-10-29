Meteor.publish("icons", function () {
  return Icons.find();
});

Icons.allow({
  insert: allowInRole("icons"),
  update: allowInRole("icons"),
  remove: allowInRole("icons"),
  download: function () {
    return true;
  }
});
