var IconImportSchema = new SimpleSchema({
  filename: {
    type: String
  },
  name: {
    type: String
  }
});

Meteor.methods({

  "icons.import.names": function (data) {
    access().from(this.userId).as("icons");
    check(data, [IconImportSchema]);
    var updated = 0;
    Icons.find().forEach(function (icon) {
      // find this icon in the imported data
      var info = _.find(data, function (info) {
        return info.filename == icon.name();
      });
      if (!info) return;
      // update display name
      Icons.update(icon._id, { $set: { displayName: info.name } });
      updated++;
    });
    console.log("received icon names:", data.length);
    console.log("updated icon names:", updated, "of", Icons.find().count());
    return updated;
  }

});
