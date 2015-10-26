Meteor.methods({
  "layout.comment.add": function (id, comment) {
    check(id, String);
    check(comment, String);
    if (!Meteor.userId()) throw new Meteor.Error(401, "Unauthorized");
    var layout = Layouts.findOne(id);
    if (!layout) throw new Meteor.Error(404, "Not Found");
    return LayoutComments.insert({
      layoutId: id,
      creator: Meteor.userId(),
      content: comment
    });
  },

  "layout.comment.remove": function (id) {
    check(id, String);
    if (!Meteor.userId()) throw new Meteor.Error(401, "Unauthorized");
    var comment = LayoutComments.findOne(id);
    if (!comment) throw new Meteor.Error(404, "Not Found");
    return LayoutComments.remove(id);
  }
});
