Layouts = new Mongo.Collection("layouts");

Layouts.attachSchema(new SimpleSchema({
  creator: {
    type: String
  },
  createdAt: {
    type: Date
  },
  objects: {
    type: [Object]
  },
  "objects.$.x": {
    type: Number
  },
  "objects.$.y": {
    type: Number
  },
  "objects.$.width": {
    type: Number
  },
  "objects.$.height": {
    type: Number
  },
  "objects.$.color": {
    type: String
  },
  boundingBox: {
    type: Object
  },
  "boundingBox.left": {
    type: Number
  },
  "boundingBox.top": {
    type: Number
  },
  "boundingBox.right": {
    type: Number
  },
  "boundingBox.bottom": {
    type: Number
  }
}));
