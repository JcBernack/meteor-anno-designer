Template.iconList.helpers({
  icons: function () {
    return Icons.find();
  },
  active: function () {
    return Session.equals("icons.selected", this._id) ? "active" : "";
  }
});

Template.iconList.events({
  "click button.icon": function () {
    Session.set("icons.selected", this._id);
    console.log("selected icon: " + this._id);
  },
  "tag.add": function (event) {
    Meteor.call("icon.tag.add", this._id, event.newTag);
  },
  "tag.remove": function (event) {
    Meteor.call("icon.tag.remove", this._id, event.removedTag);
  }
});

Template.iconEditor.helpers({
  selectedIcon: function () {
    return Icons.findOne(Session.get("icons.selected"));
  },
  saveDisabled: function () {
    var icon = Icons.findOne(Session.get("icons.selected"));
    return icon ? "" : "disabled";
  },
  iconSchema: function () {
    return new SimpleSchema({
      displayName: {
        type: String
      }
    });
  }
});

AutoForm.hooks({
  iconForm: {
    onSubmit: function() {
      try {
        Icons.update(this.docId, this.updateDoc);
        console.log("updated icon: " + this.docId);
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

Template.iconUpload.onCreated(function () {
  this.tags = new ReactiveVar(["untagged"]);
});

Template.iconUpload.helpers({
  tags: function () {
    return Template.instance().tags.get();
  }
});

Template.iconUpload.events({
  "tag.add": function (event, template) {
    var tags = template.tags.get();
    tags.push(event.newTag);
    template.tags.set(tags);
  },
  "tag.remove": function (event, template) {
    var tags = template.tags.get();
    var i = tags.indexOf(event.removedTag);
    if (i > -1) tags.splice(i, 1);
    template.tags.set(tags);
  },
  "change .input-icon-files": function (event, template) {
    FS.Utility.eachFile(event, function (file) {
      var newFile = new FS.File(file);
      //TODO: validate on the server
      newFile.displayName = newFile.name();
      newFile.tags = template.tags.get();
      Icons.insert(newFile, function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        console.log("uploading file: " + fileObj._id);
      });
    });
    event.target.form.reset();
  }
});

Template.iconUploadStatus.helpers({
  uploads: function () {
    var uploading = [];
    Icons.find().forEach(function (icon) {
      if (!icon.isUploaded()) {
        uploading.push(icon);
      }
    });
    return uploading;
  }
});
