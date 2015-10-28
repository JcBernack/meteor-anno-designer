Template.users.helpers({
  users: function() {
    return Meteor.users.find();
  },
  selectedUser: function() {
    return Meteor.users.findOne(Session.get("selectedUserId"));
  }
});

Template.userRow.helpers({
  active: function() {
    return Session.equals("selectedUserId", this._id) && "active";
  },
  ifCurrentUser: function(value) {
    return Meteor.userId() === this._id ? value : null;
  },
  roles: function() {
    return Roles.getAllRoles();
  },
  roleActive: function() {
    return Roles.userIsInRole(Template.parentData(1)._id, this.name) ? "btn-success" : "btn-danger";
  }
});

Template.userRow.events({
  "click button.list-group-item": function() {
    Session.set("selectedUserId", this._id);
  },
  "click .user-role": function(event, template) {
    Meteor.call("toggleUserRole", template.data._id, this.name);
    // prevent click-through
    return false;
  },
  "click .user-remove": function() {
    Meteor.users.remove(this._id);
    // prevent click-through
    return false;
  }
});
