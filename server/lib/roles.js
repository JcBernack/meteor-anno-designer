// make sure all required roles are added in advance
console.log("Adding user roles");
Meteor.roles.remove({});
Meteor.roles.insert({ name: "useradmin" });
Meteor.roles.insert({ name: "presets" });
Meteor.roles.insert({ name: "icons" });
Meteor.roles.insert({ name: "moderator" });
