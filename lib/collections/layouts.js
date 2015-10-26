Layouts = new Mongo.Collection("layouts");

Layouts.attachSchema(new SimpleSchema({
  creator: {
    type: String
  },
  // Force value to be current date (on server) upon insert and prevent updates thereafter.
  createdAt: {
    type: Date,
    autoValue: function () {
      if (this.isInsert) {
        return new Date;
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    }
  },
  // Force value to be current date (on server) upon update and don't allow it to be set upon insert.
  updatedAt: {
    type: Date,
    autoValue: function () {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true
  },
  objects: {
    type: [Object],
    defaultValue: []
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
  "objects.$.label": {
    type: String,
    optional: true
  },
  "objects.$.icon": {
    type: String,
    optional: true
  },
  boundingBox: {
    type: Object,
    defaultValue: { left: 0, top: 0, right: 0, bottom: 0 }
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
