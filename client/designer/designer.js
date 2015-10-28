Template.buildingSettings.onCreated(function () {
  // set initial building options
  var defaultBuilding = { width: 4, height: 4, color: "#ff0000" };
  var icon = Icons.findOne({ tags: { $all: ["warehouse"] } });
  if (icon) defaultBuilding.icon = icon._id;
  Session.setDefault("designer.placementObject", defaultBuilding);
  Session.setDefault("designer.placementActive", false);
});

Template.buildingSettings.helpers({
  get: function (property) {
    return Session.get("designer.placementObject")[property];
  }
});

Template.buildingSettings.events({
  "submit form": function (event) {
    event.preventDefault();
    Session.set("designer.placementObject", {
      width: Number.parseInt(event.target.width.value),
      height: Number.parseInt(event.target.height.value),
      color: event.target.color.value,
      label: event.target.label.value,
      icon: event.target.icon.value
    });
    Session.set("designer.placementActive", true);
    console.log("placement started");
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
