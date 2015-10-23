Meteor.publish("layouts", function () {
  return Layouts.find();
});

Meteor.publish("layouts.user", function (userId) {
  return Layouts.find({ creator: userId });
});

Meteor.publish("layout", function (id) {
  return Layouts.find(id);
});

Layouts.allow({
  remove: function () {
    return true;
  }
});
