Template.iconList.helpers({
  icons: function () {
    return Icons.find();
  }
});

Template.iconList.events({
  "tag.added": function (event) {
    Meteor.call("icon.tag.add", this._id, event.newTag);
  },
  "tag.removed": function (event) {
    Meteor.call("icon.tag.remove", this._id, event.removedTag);
  }
});

Template.iconUpload.helpers({
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

Template.iconUpload.events({
  "change .input-file": function (event) {
    FS.Utility.eachFile(event, function (file) {
      var newFile = new FS.File(file);
      //TODO: move to server
      newFile.tags = ["untagged"];
      Icons.insert(newFile, function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        console.log("uploading file: " + fileObj._id);
      });
    });
    event.target.form.reset();
  }
});
