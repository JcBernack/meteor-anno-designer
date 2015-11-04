function addTagAccess(name, collection, role, userField) {
  var obj = {};

  var minTagLength = 3;
  var maxTagLength = 32;
  var maxTags = 32;

  obj[name + ".tag.add"] = function (id, tag) {
    check(tag, String);
    tag = tag.trim().toLowerCase();
    if (tag.length < minTagLength || tag.length > maxTagLength) {
      throw new Meteor.Error(400, "Bad Request", "Tags must be between " + minTagLength + " and " + maxTagLength + " characters long.");
    }
    var item = Access().from(this.userId).to(collection, id).as(role, userField).value();
    if (item.tags) {
        if (item.tags.indexOf(tag) > -1) {
          throw new Meteor.Error(400, "Bad Request", "Tag already exists.");
        }
        if (item.tags.length >= maxTags) {
          throw new Meteor.Error(400, "Bad Request", "Maximum number of tags exceeded.");
        }
    }
    collection.update(id, { $addToSet: { tags: tag } });
    console.log("added tag \"" + tag + "\" to " + name + " " + id);
  };

  obj[name + ".tag.remove"] = function (id, tag) {
    check(tag, String);
    Access().from(this.userId).to(collection, id).as(role, userField);
    collection.update(id, { $pull: { tags: tag } });
    console.log("removed tag \"" + tag + "\" from " + name + " " + id);
  };

  Meteor.methods(obj);
}

addTagAccess("icon", Icons, "icons");
addTagAccess("preset", Presets, "presets");
addTagAccess("layout", Layouts, "moderator", "creator");
