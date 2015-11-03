AutoForm.addInputType("taggedPicker", {
  template: "afTaggedPicker",
  valueOut: function () {
    return this.val();
  },
  contextAdjust: function (context) {
    if (!context.atts.filterSelector) {
      context.atts.filterSelector = { tags: "$all" };
    }
    if (!context.atts.placeholder) {
      context.atts.placeholder = "filter, by, tags";
    }
    return context;
  }
});

function buildFilter(words, fields) {
  // remove empty elements
  words = _.filter(words, function (word) {
    return word.trim();
  });
  // select all elements when no filter is active
  if (words.length == 0) return {};
  // convert inputs to regular expressions
  var regexps = _.map(words, function (word) {
    return new RegExp(word.trim(), "i");
  });
  // build selector objects
  var filters = _.map(fields, function (value, key) {
    var obj = {};
    obj[key] = {};
    obj[key][value] = regexps;
    return obj;
  });
  // leave out the $or operator when there is just one filter
  if (filters.length == 1) return filters[0];
  // connect all filters with $or
  return { $or: filters };
}

Template.afTaggedPicker.onCreated(function () {
  var collection = this.data.atts.collection;
  this.collection = Match.test(collection, String) ? window[collection] : collection;
  this.selectedId = new ReactiveVar("");
  this.filter = new ReactiveVar(buildFilter([], this.data.atts.filterSelector));
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
    delete atts.filterSelector;
    delete atts.placeholder;
    delete atts.elementTemplate;
    return atts;
  },
  placeholder: function () {
    return Template.instance().data.atts.placeholder;
  },
  elements: function () {
    var template = Template.instance();
    var limit = !template.data.atts.limit ? {} : { limit: template.data.atts.limit };
    return template.collection.find(template.filter.get(), limit);
  },
  count: function (matches) {
    var template = Template.instance();
    if (matches) {
      return template.collection.find(template.filter.get()).count();
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
    template.filter.set(buildFilter(event.target.value.split(","), template.data.atts.filterSelector));
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
