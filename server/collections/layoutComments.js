Meteor.publish("layoutComments", function (layoutId) {
  check(layoutId, String);
  return LayoutComments.find({ layoutId: layoutId });
});
