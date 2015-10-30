Template.afTagInput.onCreated(function () {
  this.tags = new ReactiveVar([{ name: "anno 2070"}, { name: "test" }]);
  if (this.data && this.data.tags) {
    this.tags.set(this.data.tags);
  }
});

Template.afTagInput.helpers({
  tags: function () {
    var template = Template.instance();
    return template.tags.get();
  },
  labelClass: function () {
    return this.invalid ? "label-danger" : "label-primary";
  }
});

Template.afTagInput.events({
  "keydown input": function (event, template) {
    // enter or comma
    var tags;
    if (event.keyCode === 13 || event.keyCode === 188 && !event.shiftKey) {
      console.log("parsing tag");
      event.preventDefault();
      var value = event.currentTarget.value.trim();
      if (!value) return;
      tags = template.tags.get();
      // set all tags as valid
      _.forEach(tags, function (tag) {
        tag.invalid = false;
      });
      // set duplicate tag as invalid
      var duplicate = _.find(tags, function (tag) {
        return tag.name == value;
      });
      if (duplicate) {
        duplicate.invalid = true;
      } else {
        tags.push({ name: value });
        event.currentTarget.value = "";
      }
      template.tags.set(tags);
      console.log("added tag: " + value);
    }
    // backspace
    if (event.keyCode === 8) {
      if (event.currentTarget.value.length > 0) return;
      tags = template.tags.get();
      if (tags.length == 0) return;
      var removed = tags.splice(-1,1)[0].name;
      template.tags.set(tags);
      event.currentTarget.value = removed;
      event.preventDefault();
      console.log("removed tag: " + removed);
    }
  }
});
