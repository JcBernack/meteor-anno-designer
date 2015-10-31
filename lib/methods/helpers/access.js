access = function access() {
  var user;
  var value;

  this.from = function (userId) {
    if (!userId) throw new Meteor.Error(401, "Unauthorized");
    user = userId;
    console.log("is logged in", user);
    return this;
  };

  // gets an item from a collection by id
  this.to = function (collection, id) {
    check(id, String);
    value = collection.findOne(id);
    if (!value) throw new Meteor.Error(404, "Not Found");
    console.log("found item", id);
    return this;
  };

  // requires the user to be in at least one of the given roles
  this.withRole = function (roles) {
    if (!Roles.userIsInRole(user, roles)) {
      throw new Meteor.Error(403, "Forbidden");
    }
    console.log("has role", roles);
    return this;
  };

  // requires a given field to contain the users id
  this.as = function (field, roleOverwrite) {
    if (value[field] !== user && (!roleOverwrite || !Roles.userIsInRole(user, roleOverwrite))) {
      throw new Meteor.Error(403, "Forbidden");
    }
    console.log("as", field, "or", roleOverwrite);
    return this;
  };

  // returns the value stored by item()
  this.value = function () {
    return value;
  };

  return this;
};
