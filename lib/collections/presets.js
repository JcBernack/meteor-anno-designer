Presets = new Mongo.Collection("presets");

//TODO: add building costs
Presets.attachSchema(new SimpleSchema({
  name: {
    type: String
  },
  width: {
    type: Number,
    min: 1
  },
  height: {
    type: Number,
    min: 1
  },
  icon: {
    type: String,
    autoform: {
      type: "taggedPicker"
    }
  },
  influenceRadius: {
    type: Number,
    defaultValue: 0
  },
  tags: {
    type: [String],
    min: 2,
    max: 32,
    minCount: 1
  }
}));
