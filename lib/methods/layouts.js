Meteor.methods({
  "layout.insert": function () {
    if (!this.userId) throw new Meteor.Error(401, "Unauthorized");
    var id = Layouts.insert({
      creator: this.userId
    });
    console.log("created new layout: " + id);
    return id;
  },

  "layout.remove": function (id) {
    check(id, String);
    if (!this.userId) throw new Meteor.Error(401, "Unauthorized");
    var layout = Layouts.findOne(id);
    if (!layout) throw new Meteor.Error(404, "Not Found");
    if (layout.creator !== this.userId && !Roles.userIsInRole(this.userId, "moderator")) {
      throw new Meteor.Error(403, "Forbidden");
    }
    Layouts.remove(id);
    console.log("removed layout: " + id);
  },

  "layout.comment.add": function (id, comment) {
    check(id, String);
    check(comment, String);
    if (!this.userId) throw new Meteor.Error(401, "Unauthorized");
    var layout = Layouts.findOne(id);
    if (!layout) throw new Meteor.Error(404, "Not Found");
    return LayoutComments.insert({
      layoutId: id,
      creator: this.userId,
      content: comment
    });
  },

  "layout.comment.remove": function (id) {
    check(id, String);
    if (!this.userId) throw new Meteor.Error(401, "Unauthorized");
    var comment = LayoutComments.findOne(id);
    if (!comment) throw new Meteor.Error(404, "Not Found");
    if (comment.creator !== this.userId && !Roles.userIsInRole(this.userId, "moderator")) {
      throw new Meteor.Error(403, "Forbidden");
    }
    return LayoutComments.remove(id);
  }
});
