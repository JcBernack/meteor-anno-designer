Meteor.methods({
  "layout.insert": function() {
    if (!Meteor.userId()) throw new Meteor.Error(401, "Unauthorized");
    return Layouts.insert({
      creator: Meteor.userId(),
      createdAt: new Date(),
      objects: []
    });
  }
});
