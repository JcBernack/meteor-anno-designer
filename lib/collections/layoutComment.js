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
  createdAt: {
    type: Date
  },
  content: {
    type: String
  }
}));
