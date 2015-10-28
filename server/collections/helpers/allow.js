allowLoggedIn = function(userId) {
  return userId;
};

allowInRole = function(role) {
  return function(userId) {
    return Roles.userIsInRole(userId, role);
  };
};
