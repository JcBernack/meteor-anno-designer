Template.iconList.helpers({
  icons: function () {
    return Icons.find();
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
      Icons.insert(file, function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
        console.log("uploading file: " + fileObj._id);
      });
    });
    event.target.form.reset();
  }
});
