Template.layoutView.helpers({
  allowDelete: function (userId) {
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
  }
});
