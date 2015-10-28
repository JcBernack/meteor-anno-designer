publishAuthed = function(name, func) {
  Meteor.publish(name, function(){
    if (!this.userId) {
      throw new Meteor.Error(401, "Unauthorized", "Please log in.");
    }
    return func.apply(this);
  });
};

publishForRole = function(name, role, func) {
  Meteor.publish(name, function(){
    if (!Roles.userIsInRole(this.userId, role)) {
      throw new Meteor.Error(403, "Forbidden", "User must be in role: " + role);
    }
    return func.apply(this);
  });
};
