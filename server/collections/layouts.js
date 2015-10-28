Meteor.publish("layouts", function () {
  return Layouts.find();
});

Meteor.publish("layouts.user", function (userId) {
  check(userId, String);
  return Layouts.find({ creator: userId });
});

Meteor.publish("layout", function (layoutId) {
  check(layoutId, String);
  return Layouts.find(layoutId);
});
