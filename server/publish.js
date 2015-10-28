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

Meteor.publish("layoutComments", function (layoutId) {
  check(layoutId, String);
  return LayoutComments.find({ layoutId: layoutId });
});

//TODO: add named publication and subscribe only when needed
Meteor.publish(null, function () {
  return Meteor.users.find({}, { username: 1 });
});

Meteor.publish("presets", function () {
  return Presets.find();
});

Meteor.publish("icons", function () {
  return Icons.find();
});

Presets.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  }
});

Icons.allow({
  insert: function () {
    return true;
  },
  update: function () {
    return true;
  },
  remove: function () {
    return true;
  },
  download: function () {
    return true;
  }
});
