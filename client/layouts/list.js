Template.layoutList.onCreated(function () {
  this.subscribe("layouts");
});

Template.layoutList.helpers({
  layouts: function () {
    return Layouts.find({}, { sort: { createdAt: -1 } });
  }
});
