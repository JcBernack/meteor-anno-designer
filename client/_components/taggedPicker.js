Template.taggedPicker.onCreated(function () {
  this.filter = new ReactiveVar([""]);
  this.selectedId = new ReactiveVar("");
  var self = this;
  this.autorun(function () {
    // update selectedId when the data context changes
    self.selectedId.set(Template.currentData().value);
  });
});

Template.taggedPicker.onRendered(function () {
  var self = this;
  this.autorun(function () {
    // update the backing field when selectedId changes
    self.find(".tagged-picker-backing-field").value = self.selectedId.get();
  });
});

Template.taggedPicker.helpers({
  elements: function () {
    var collection = window[this.collection];
    var filter = Template.instance().filter.get();
    var tags = _.map(filter, function (tag) {
      return new RegExp(tag.trim(), "i");
    });
    var cursor = collection.find({ tags: { $all: tags } });
    console.log("found " + cursor.count() + " elements");
    return cursor;
  },
  selectedElement: function () {
    var collection = window[this.collection];
    return collection.findOne(Template.instance().selectedId.get());
  },
  active: function () {
    return Template.instance().selectedId.get() == this._id ? "active" : "";
  }
});

Template.taggedPicker.events({
  "click .tagged-picker-toggle": function (event, template) {
    template.find(".tagged-picker-tags").focus();
  },
  "input .tagged-picker-tags": function (event, template) {
    template.filter.set(event.target.value.split(","));
  },
  "click .dropdown-menu a": function (event, template) {
    var id = event.currentTarget.dataset.id;
    template.selectedId.set(id);
    console.log("selected element: " + id);
  }
});
