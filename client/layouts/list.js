Template.layoutList.onCreated(function () {
  this.subscribe("layouts");
});

Template.layoutList.helpers({
  layouts: function () {
    return Layouts.find({}, { sort: { createdAt: -1 } });
  }
});

Template.layoutList.events({
  "click button.remove": function (event) {
    event.preventDefault();
    Meteor.call("layout.remove", this._id);
  }
});
