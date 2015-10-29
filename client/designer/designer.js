Template.buildingSettings.onCreated(function () {
  // set initial building options
  var defaultBuilding = { width: 4, height: 4, color: "#ff0000" };
  var icon = Icons.findOne({ tags: { $all: ["warehouse"] } });
  if (icon) defaultBuilding.icon = icon._id;
  Session.setDefault("designer.placementObject", defaultBuilding);
  Session.setDefault("designer.placementActive", false);
});

Template.buildingSettings.helpers({
  placementObject: function (property) {
    return Session.get("designer.placementObject");
  },
  buildingSchema: function () {
    return LayoutObjectSchema.pick(["width", "height", "label", "color", "icon"]);
  }
});

Template.layoutDetails.helpers({
  width: function () {
    var bb = this.boundingBox;
    return bb.right - bb.left;
  },
  height: function () {
    var bb = this.boundingBox;
    return bb.bottom - bb.top;
  }
});

AutoForm.hooks({
  buildingForm: {
    onSubmit: function () {
      Session.set("designer.placementObject", this.insertDoc);
      Session.set("designer.placementActive", true);
      console.log("placement started");
      // prevent post back
      this.done();
      return false;
    },
    onError: function (formType, err) {
      console.log(err);
    }
  }
});
