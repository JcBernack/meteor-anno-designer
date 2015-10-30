AutoForm.addInputType("taggedPicker", {
  template: "afTaggedPicker",
  valueOut: function () {
    return this.val();
  }
});

Template.afTaggedPicker.onCreated(function () {
  this.filter = new ReactiveVar([new RegExp()]);
  this.selectedId = new ReactiveVar("");
  if (Match.test(this.data.atts.collection, String)) {
    this.collection = window[this.data.atts.collection];
  } else {
    this.collection = this.data.atts.collection;
  }
  var self = this;
  this.autorun(function () {
    // update selectedId when the data context changes
    self.selectedId.set(Template.currentData().value);
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
  filteredAtts: function () {
    var atts = _.clone(this.atts);
    delete atts.id;
    delete atts.collection;
    delete atts.limit;
    delete atts.elementTemplate;
    return atts;
  },
  elements: function () {
    var template = Template.instance();
    var limit = !template.data.atts.limit ? {} : { limit: template.data.atts.limit };
    var cursor = template.collection.find({ tags: { $all: template.filter.get() } }, limit);
    return cursor;
  },
  count: function (matches) {
    var template = Template.instance();
    if (matches) {
      return template.collection.find({ tags: { $all: template.filter.get() } }).count();
    } else {
      return template.collection.find().count();
    }
  },
  selectedElement: function () {
    var template = Template.instance();
    return template.collection.findOne(template.selectedId.get());
  },
  active: function () {
    var template = Template.instance();
    return template.selectedId.get() == this._id ? "active" : "";
  },
  elementTemplate: function () {
    var template = Template.instance();
    return template.data.atts.elementTemplate;
  }
});

Template.afTaggedPicker.events({
  //TODO: try to hook up an event from the dropdown directly: http://getbootstrap.com/javascript/#dropdowns
  //"click .dropdown-toggle": function (event, template) {
  //  template.find(".tagged-picker-tags").focus();
  //},
  "input .tagged-picker-tags input": function (event, template) {
    var tags = _.map(event.target.value.split(","), function (tag) {
      return new RegExp(tag.trim(), "i");
    });
    template.filter.set(tags);
  },
  "click .dropdown-menu a": function (event, template) {
    template.selectedId.set(this._id);
  }
});
