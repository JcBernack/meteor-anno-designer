Template.layouts.onCreated(function () {
  this.subscribe("layouts");
});

Template.layouts.helpers({
  layouts: function () {
    return Layouts.find({}, { sort: { createdAt: -1 } });
  }
});

Template.layouts.events({
  "click button": function (event) {
    event.preventDefault();
    Layouts.remove(this._id);
  }
});
