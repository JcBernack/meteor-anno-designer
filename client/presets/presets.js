Template.presetList.helpers({
  presets: function () {
    return Presets.find();
  },
  active: function () {
    return Session.equals("presets.selected", this._id) ? "active" : "";
  }
});

Template.presetList.events({
  "click button.preset": function () {
    Session.set("presets.selected", this._id);
    console.log("selected preset: " + this._id);
  },
  "click button.preset-remove": function () {
    Presets.remove(this._id);
    console.log("removed preset: " + this._id);
    // prevent click-through
    return false;
  },
  "tag.added": function (event) {
    Meteor.call("preset.tag.add", this._id, event.newTag);
  },
  "tag.removed": function (event) {
    Meteor.call("preset.tag.remove", this._id, event.removedTag);
  }
});

Template.presetEditor.helpers({
  selectedPreset: function () {
    return Presets.findOne(Session.get("presets.selected"));
  },
  saveDisabled: function () {
    var preset = Presets.findOne(Session.get("presets.selected"));
    return preset ? "" : "disabled";
  }
});

Template.presetEditor.events({
  "click button.preset-insert": function () {
    Session.set("presets.overwrite", false);
    $("form#presetForm").submit();
  },
  "click button.preset-update": function () {
    Session.set("presets.overwrite", true);
    $("form#presetForm").submit();
  }
});

AutoForm.hooks({
  presetForm: {
    onSubmit: function() {
      try {
        if (Session.equals("presets.overwrite", false)) {
          var id = Presets.insert(this.insertDoc);
          Session.set("presets.selected", id);
          console.log("inserted preset: " + id);
          console.log(this.insertDoc);
        } else {
          Presets.update(this.docId, this.updateDoc);
          console.log("updated preset: " + this.docId);
        }
        // tell autoform that were done here
        this.done();
      } catch (err) {
        // catch any error and pass it to the callback,
        // otherwise a post back would occur because the "return false" was skipped
        this.done(err);
      }
      // prevent post back of form submit
      return false;
    },
    onError: function (formType, err) {
      console.log(err);
    }
  }
});
