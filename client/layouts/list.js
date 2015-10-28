Template.layoutList.helpers({
  layouts: function () {
    return Layouts.find({}, { sort: { createdAt: -1 } });
  }
});
