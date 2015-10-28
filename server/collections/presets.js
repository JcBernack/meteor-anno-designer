Meteor.publish("presets", function () {
  return Presets.find();
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
