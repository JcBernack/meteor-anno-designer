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
