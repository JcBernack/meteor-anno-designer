Template.buildingSettings.onCreated(function () {
  // set initial building options
  var defaultPreset = Presets.findOne({ name: "Depot" });
  Session.setDefault("designer.placementObject", {
    color: "#ff0000",
    label: "",
    width: defaultPreset.width,
    height: defaultPreset.height,
    iconId: defaultPreset.iconId,
    presetId: defaultPreset._id
  });
  Session.setDefault("designer.placementActive", false);
});

Template.buildingSettings.helpers({
  get: function (property) {
    if (!property) return Session.get("designer.placementObject");
    return Session.get("designer.placementObject")[property];
  },
  presetFilter: function () {
    return { tags: "$all", name: "$in" };
  },
  iconFilter: function () {
    return { tags: "$all", displayName: "$in" };
  }
});

Template.buildingSettings.events({
  "filtered-picker.change": function (event, template, data) {
    console.log("picker changed");
    var obj = Session.get("designer.placementObject");
    obj[data.name] = data.selectedId;
    Session.set("designer.placementObject", obj);
  },
  "submit": function (event, template) {
    try {
      var obj = {
        color: event.target.color.value,
        label: event.target.label.value
      };
      var preset = Presets.findOne(event.target.presetId.value);
      if (preset) {
        obj.width = preset.width;
        obj.height = preset.height;
        obj.iconId = preset.iconId;
        obj.presetId = preset._id;
      } else {
        obj.width = parseInt(event.target.width.value);
        obj.height = parseInt(event.target.height.value);
        obj.iconId = event.target.iconId.value;
      }
      if (!Match.test(obj, LayoutObjectSchema.pick("color", "label", "width", "height", "iconId", "presetId"))) {
        console.log("object invalid");
      } else {
        Session.set("designer.placementObject", obj);
        Session.set("designer.placementActive", true);
        console.log("placement started");
      }
    } catch (err) {
      // catch any error and pass it to the callback,
      // otherwise a post back would occur because the "return false" was skipped
      console.log(err);
    }
    // prevent post back
    return false;
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

Template.layoutDetails.events({
  "tag.add": function (event) {
    Meteor.call("layout.tag.add", this._id, event.newTag);
  },
  "tag.remove": function (event) {
    Meteor.call("layout.tag.remove", this._id, event.removedTag);
  }
});
