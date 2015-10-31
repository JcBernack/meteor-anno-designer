function addTagAccess(name, collection, role, userField) {
  var obj = {};

  function hasAccess(userId, id) {
    var auth = access()
      .from(userId)
      .to(collection, id);
    if (userField) {
      auth.as(userField, role)
    } else {
      auth.withRole(role);
    }
    return auth.value();
  }

  obj[name + ".tag.add"] = function (id, tag) {
    check(tag, String);
    tag = tag.trim().toLowerCase();
    if (tag.length == 0) {
      throw new Meteor.Error(400, "Bad Request", "Empty tag.");
    }
    var item = hasAccess(this.userId, id);
    if (item.tags.indexOf(tag) > -1) {
      throw new Meteor.Error(400, "Bad Request", "Duplicate tag found.");
    }
    collection.update(id, { $push: { tags: tag } });
    console.log("added tag \"" + tag + "\" to " + name + " " + id);
  };

  obj[name + ".tag.remove"] = function (id, tag) {
    check(tag, String);
    hasAccess(this.userId, id);
    collection.update(id, { $pull: { tags: tag } });
    console.log("removed tag \"" + tag + "\" from " + name + " " + id);
  };

  Meteor.methods(obj);
}

addTagAccess("icon", Icons, "icons");
addTagAccess("preset", Presets, "presets");
addTagAccess("layout", Layouts, "moderator", "creator");
