Meteor.methods({
  "presets.import": function (data) {
    Access().from(this.userId).as("import");
    check(data, [PresetSchema]);
    var inserted = 0;
    var updated = 0;
    _.forEach(data, function (preset) {
      // find icon matched by filename
      var icon = Icons.findOne({ "original.name": preset.iconId });
      if (icon) preset.iconId = icon._id;
      else console.log("icon for " + preset.name + " not found");
      // check if preset is already existing
      var original = Presets.findOne({ name: preset.name });
      if (original) {
        console.log("overwriting preset: " + preset.name);
        Presets.update(original._id, { $set: preset });
        updated++;
        return;
      }
      Presets.insert(preset);
      inserted++;
    });
    console.log("received presets:", data.length);
    console.log("insert/updated presets: " + inserted + "/" + updated);
    console.log("total number of presets: ", Presets.find().count());
    return updated;
  }
});
