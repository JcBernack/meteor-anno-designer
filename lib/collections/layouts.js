Layouts = new Mongo.Collection("layouts");

LayoutObjectSchema = new SimpleSchema({
  x: {
    type: Number
  },
  y: {
    type: Number
  },
  width: {
    type: Number,
    min: 1
  },
  height: {
    type: Number,
    min: 1
  },
  label: {
    type: String,
    optional: true
  },
  color: {
    type: String,
    // either contains a color value like "red", "#ff0000", etc.
    // or a special value like $type.n which references to the n'th color for $type from a color scheme
    autoform: {
      type: "color"
    }
  },
  icon: {
    type: String,
    // if given, should override the icon from the referenced building
    optional: true,
    autoform: {
      type: "taggedPicker",
      collection: "Icons",
      limit: 5
    }
  },
  presetId: {
    type: String,
    optional: true,
    autoform: {
      type: "taggedPicker",
      collection: "Presets",
      limit: 10
    }
  }
});

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
  },
  objects: {
    type: [LayoutObjectSchema],
    maxCount: 500,
    defaultValue: []
  },
  tags: {
    type: [String],
    defaultValue: ["untagged"]
  }
}));
