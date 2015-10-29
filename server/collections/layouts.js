Meteor.publish("layouts", function () {
  return Layouts.find();
});

Meteor.publish("layouts.user", function () {
  return Layouts.find({ creator: this.userId });
});

Meteor.publish("layout", function (layoutId) {
  check(layoutId, String);
  return Layouts.find(layoutId);
});
