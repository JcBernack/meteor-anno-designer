Meteor.methods({
  "layout.insert": function () {
    Access().from(this.userId);
    var id = Layouts.insert({
      creator: this.userId
    });
    console.log("created new layout: " + id);
    return id;
  },

  "layout.remove": function (id) {
    Access().from(this.userId).to(Layouts, id).as("moderator", "creator");
    Layouts.remove(id);
    console.log("removed layout: " + id);
  },

  "layout.comment.add": function (id, comment) {
    check(comment, String);
    Access().from(this.userId).to(Layouts, id);
    return LayoutComments.insert({
      layoutId: id,
      creator: this.userId,
      content: comment
    });
  },

  "layout.comment.remove": function (id) {
    Access().from(this.userId).to(LayoutComments, id).as("moderator", "creator");
    return LayoutComments.remove(id);
  }
});
