Presets = new Mongo.Collection("presets");

//TODO: add building costs
Presets.attachSchema(new SimpleSchema({
  name: {
    type: String
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  icon: {
    type: String,
    optional: true
  },
  influenceRadius: {
    type: Number,
    optional: true
  },
  tags: {
    type: [String],
    defaultValue: []
  }
}));
