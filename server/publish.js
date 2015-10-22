Meteor.publish("layouts", function () {
  return Layouts.find();
});
