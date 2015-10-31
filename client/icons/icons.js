Template.iconList.helpers({
  icons: function () {
    return Icons.find();
  }
});

Template.iconList.events({
  "tag.added": function (event, template) {
    console.log("add tag \"" + event.newTag + "\" to icon " + this._id);
    Icons.update(this._id, { $push: { tags: event.newTag } });
  },
  "tag.removed": function (event, template) {
    console.log("remove tag \"" + event.removedTag + "\" from icon " + this._id);
    Icons.update(this._id, { $pull: { tags: event.removedTag } });
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
