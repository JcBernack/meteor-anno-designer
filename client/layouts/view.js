Template.layoutView.helpers({
  hasAccess: function (userId) {
    return Meteor.userId() === userId || Roles.userIsInRole(Meteor.userId(), "moderator");
  },
  comments: function () {
    return LayoutComments.find({ layoutId: this._id }, { sort: { createdAt: 1 } });
  }
});

Template.layoutView.events({
  "click button.remove-layout": function () {
    Meteor.call("layout.remove", this._id);
    Router.go("layout.list");
  },

  "click button.remove-comment": function () {
    Meteor.call("layout.comment.remove", this._id);
  },

  "submit form.comment": function (event) {
    event.preventDefault();
    Meteor.call("layout.comment.add", this._id, event.target.comment.value);
    event.target.comment.value = "";
  },

  "tag.add": function (event) {
    Meteor.call("layout.tag.add", this._id, event.newTag);
  },

  "tag.remove": function (event) {
    Meteor.call("layout.tag.remove", this._id, event.removedTag);
  }
});
