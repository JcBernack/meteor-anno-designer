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

Template.filteredPicker.onCreated(function () {
  var collection = this.data.collection;
  this.collection = Match.test(collection, String) ? window[collection] : collection;
  if (!this.data.filterSelector) this.data.filterSelector = { tags: "$all" };
  if (!this.data.placeholder) this.data.placeholder = "filter, by, tags";
  if (!this.data.noneLabel) this.data.noneLabel = "None";
  this.selectedId = new ReactiveVar("");
  this.filter = new ReactiveVar(buildFilter([], this.data.filterSelector));
  var self = this;
  this.autorun(function () {
    // update selectedId when the data context changes
    self.selectedId.set(Template.currentData().value);
  });
});

Template.filteredPicker.onRendered(function () {
  var self = this;
  this.autorun(function () {
    // update the backing field when selectedId changes
    self.find(".filtered-picker-backing-field").value = self.selectedId.get();
    //var element = $(self.find(".tagged-picker-backing-field"));
    //element.val(self.selectedId.get()).trigger("change");
  });
});

Template.filteredPicker.helpers({
  elements: function () {
    var template = Template.instance();
    var limit = !template.data.limit ? {} : { limit: template.data.limit };
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
  }
});

Template.filteredPicker.events({
  // focus the filter input when the dropdown is opened
  "shown.bs.dropdown": function (event, template) {
    template.find(".filtered-picker-tags input").focus();
  },
  // close dropdown when escape is pressed within the filter input
  //"keydown .filtered-picker-tags input": function (event, template) {
    // escape
    //if (event.which == 27) {
    //  console.log("close dropdown");
    //  $(template.find(".tagged-picker .dropdown-menu")).hide();
    //}
  //},
  // update filter while typing
  "input .filtered-picker-tags input": function (event, template) {
    template.filter.set(buildFilter(event.target.value.split(","), template.data.filterSelector));
  },
  // select item
  "click .filtered-picker-option a": function (event, template) {
    template.selectedId.set(this._id);
    $(event.target).trigger("filtered-picker.change" , { name: template.data.name, selectedId: this._id });
  },
  // select nothing
  "click .filtered-picker-deselect a": function (event, template) {
    template.selectedId.set("");
    $(event.target).trigger("filtered-picker.change" , { name: template.data.name, selectedId: "" });
  }
});
