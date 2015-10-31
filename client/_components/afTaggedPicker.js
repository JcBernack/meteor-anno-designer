AutoForm.addInputType("taggedPicker", {
  template: "afTaggedPicker",
  valueOut: function () {
    return this.val();
  }
});

Template.afTaggedPicker.onCreated(function () {
  var collection = this.data.atts.collection
  this.collection = Match.test(collection, String) ? window[collection] : collection;
  this.selectedId = new ReactiveVar("");
  this.filter = new ReactiveVar([new RegExp()]);
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
    return template.collection.find({ tags: { $all: template.filter.get() } }, limit);
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
    var id = template.selectedId.get();
    return !this._id && !id || id === this._id ? "active" : "";
  },
  elementTemplate: function () {
    var template = Template.instance();
    return template.data.atts.elementTemplate;
  }
});

Template.afTaggedPicker.events({
  // focus the filter input when the dropdown is opened
  "shown.bs.dropdown": function (event, template) {
    template.find(".tagged-picker-tags input").focus();
  },
  // close dropdown when escape is pressed within the filter input
  //"keydown .tagged-picker-tags input": function (event, template) {
    // escape
    //if (event.which == 27) {
    //  console.log("close dropdown");
    //  $(template.find(".tagged-picker .dropdown-menu")).hide();
    //}
  //},
  // update filter while typing
  "input .tagged-picker-tags input": function (event, template) {
    var tags = _.map(event.target.value.split(","), function (tag) {
      return new RegExp(tag.trim(), "i");
    });
    template.filter.set(tags);
  },
  // select item
  "click .tagged-picker-option a": function (event, template) {
    template.selectedId.set(this._id);
  },
  // select nothing
  "click .tagged-picker-deselect a": function (event, template) {
    template.selectedId.set("");
  }
});
