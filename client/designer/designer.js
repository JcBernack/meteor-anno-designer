Template.layoutOptions.events({
  "click button.transform-cw": function () {
    Meteor.call("layout.transform", this._id, 1, false);
  },
  "click button.transform-ccw": function () {
    Meteor.call("layout.transform", this._id, -1, false);
  },
  "click button.transform-flip-vertical": function () {
    Meteor.call("layout.transform", this._id, 0, true);
  },
  "click button.transform-flip-horizontal": function () {
    Meteor.call("layout.transform", this._id, 2, true);
  },
  "click button.new": function () {
    Meteor.call("layout.insert", function (err, id) {
      if (err) throw err;
      Router.go("designer", { _id: id });
    });
  }
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
      label: event.target.label.value
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
