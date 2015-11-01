access = function access() {

  // holds the currently active user
  var user;
  // hold the current collection document
  var doc;

  // wraps our chain methods
  var chain = {};

  /**
   * Requires the given userId to be valid and stores the corresponding user for subsequent calls.
   * @param {String} userId
   */
  chain.from = function from(userId) {
    check(userId, String);
    user = Meteor.users.findOne(userId);
    if (!user) throw new Meteor.Error(401, "Unauthorized");
    return chain;
  };

  /**
   * Gets an item from a collection by id.
   * @param collection
   * @param id
   */
  chain.to = function to(collection, id) {
    check(id, String);
    doc = collection.findOne(id);
    if (!doc) throw new Meteor.Error(404, "Not Found");
    return chain;
  };

  /**
   * Requires the current user to be in at least one of the given roles or the given property to contain the users id.
   * @param {String, [String]} roles
   * @param {String} property
   */
  chain.as = function as(roles, property) {
    // check if user is in one of the given roles
    if (roles && Roles.userIsInRole(user._id, roles)) return chain;
    // check if user is the "owner", or whatever the meaning of "property" is
    if (property && doc[property] === user._id) return chain;
    // if none of the above returned the user does not have access
    throw new Meteor.Error(403, "Forbidden");
  };

  /**
   * Returns the document stored by the last call to to().
   * @returns {Object}
   */
  chain.value = function value() {
    return doc;
  };

  return chain;
};
