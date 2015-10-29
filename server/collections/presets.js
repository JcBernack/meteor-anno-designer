Meteor.publish("presets", function () {
  return Presets.find();
});

Presets.allow({
  insert: allowInRole("presets"),
  update: allowInRole("presets"),
  remove: allowInRole("presets")
});
