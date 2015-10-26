LayoutComments = new Mongo.Collection("layoutComments");

LayoutComments.attachSchema(new SimpleSchema({
  layoutId: {
    type: String
  },
  parentCommentId: {
    type: String,
    optional: true
  },
  creator: {
    type: String
  },
  // Force value to be current date (on server) upon insert and prevent updates thereafter.
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  content: {
    type: String
  }
}));
