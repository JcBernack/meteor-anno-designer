Template.tagInput.onCreated(function () {
  this.invalid = new ReactiveVar();
});

Template.tagInput.helpers({
  labelClass: function () {
    var template = Template.instance();
    return template.invalid.get() === this.toString() ? "label-danger" : "label-default";
  },
  enabled: function () {
    return this.enabled !== false;
  }
});

Template.tagInput.events({
  "keydown input": function (event, template) {
    // enter or comma
    var tags = template.data.tags;
    if (event.which === 13 || event.which === 188 && !event.shiftKey) {
      // prevent a comma from actually being entered
      event.preventDefault();
      // get the trimmed input
      var value = event.currentTarget.value.trim();
      // bail out if the trimmed value is falsey
      if (!value) return;
      // search for duplicates
      var duplicate = _.find(tags, function (tag) {
        return tag == value;
      });
      // mark duplicate as invalid
      if (duplicate) {
        template.invalid.set(duplicate);
        return;
      }
      // remove invalid mark
      template.invalid.set();
      // clear input field
      event.currentTarget.value = "";
      // raise event
      var tagAdded = $.Event("tag.added", { newTag: value });
      $(event.currentTarget).trigger(tagAdded);
    }
    // backspace
    if (event.which === 8) {
      // bail out if there is something left in the input
      //TODO: should check if the cursor is at the left-most position
      if (event.currentTarget.value.length > 0) return;
      // bail out if there are no tags left
      if (tags.length == 0) return;
      // remove the last tag from the list
      var removed = tags[tags.length-1];
      // and add it to the input field again
      event.currentTarget.value = removed;
      // prevent the backspace press from immediately removing the last character
      event.preventDefault();
      // raise event
      var tagRemoved = $.Event("tag.removed", { removedTag: removed });
      $(event.currentTarget).trigger(tagRemoved);
    }
  }
});
