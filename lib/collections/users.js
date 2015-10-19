//// source: https://github.com/aldeed/meteor-collection2#attach-a-schema-to-meteorusers
//var profileSchema = new SimpleSchema({
//  name: {
//    type: String
//  }
//});
//
//Meteor.users.attachSchema(new SimpleSchema({
//  createdAt: {
//    type: Date
//  },
//  profile: {
//    type: profileSchema
//  },
//  // Make sure this services field is in your schema if you're using any of the accounts packages
//  services: {
//    type: Object,
//    optional: true,
//    blackbox: true
//  },
//  // Add `roles` to your schema if you use the meteor-roles package.
//  // Option 1: Object type
//  // If you specify that type as Object, you must also specify the
//  // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
//  // Example:
//  // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
//  // You can't mix and match adding with and without a group since
//  // you will fail validation in some cases.
//  //roles: {
//  //  type: Object,
//  //  optional: true,
//  //  blackbox: true
//  //},
//  // Option 2: [String] type
//  // If you are sure you will never need to use role groups, then
//  // you can specify [String] as the type
//  roles: {
//    type: [String],
//    optional: true
//  }
//}));
