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
    defaultValue: []
  }
}));
