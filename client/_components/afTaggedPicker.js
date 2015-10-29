AutoForm.addInputType("taggedPicker", {
  template: "afTaggedPicker",
  valueOut: function () {
    return this.val();
  }
});

Template.afTaggedPicker.onCreated(function () {
  this.filter = new ReactiveVar([""]);
  this.selectedId = new ReactiveVar("");
  this.collection = window[this.data.atts.collection];
  this.elementTemplate = this.data.atts.elementTemplate;
  //TODO: the attributes are still added to the DOM element, prevent that
  delete this.data.atts.collection;
  delete this.data.atts.elementTemplate;
  var self = this;
  this.autorun(function () {
    // update selectedId when the data context changes
    self.selectedId.set(Template.currentData().value);
    //TODO: this causes way too many update because the x and y coordinates are part of the "placementObject", refactor
  });
});

Template.afTaggedPicker.onRendered(function () {
  var self = this;
  this.autorun(function () {
    // update the backing field when selectedId changes
    self.find(".tagged-picker-backing-field").value = self.selectedId.get();
  });
});

Template.afTaggedPicker.helpers({
  elements: function () {
    var template = Template.instance();
    var tags = _.map(template.filter.get(), function (tag) {
      return new RegExp(tag.trim(), "i");
    });
    var cursor = template.collection.find({ tags: { $all: tags } });
    console.log("found " + cursor.count() + " elements");
    return cursor;
  },
  selectedElement: function () {
    var template = Template.instance();
    return template.collection.findOne(Template.instance().selectedId.get());
  },
  active: function () {
    var template = Template.instance();
    return template.selectedId.get() == this._id ? "active" : "";
  },
  elementTemplate: function () {
    return Template.instance().elementTemplate;
  }
});

Template.afTaggedPicker.events({
  //"click .tagged-picker-toggle": function (event, template) {
  //  template.find(".tagged-picker-tags").focus();
  //},
  "input .tagged-picker-tags": function (event, template) {
    template.filter.set(event.target.value.split(","));
  },
  "click .dropdown-menu a": function (event, template) {
    var id = event.currentTarget.dataset.id;
    template.selectedId.set(id);
    console.log("selected element: " + id);
  }
});
