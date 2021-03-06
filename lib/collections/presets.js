Presets = new Mongo.Collection("presets");

//TODO: add building costs
//BuildingCostSchema = new SimpleSchema({
//  resource: {
//    type: String
//  },
//  amount: {
//    type: Number
//  }
//});

PresetSchema = new SimpleSchema({
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
  iconId: {
    type: String,
    autoform: {
      type: "taggedPicker",
      collection: "Icons",
      limit: 5,
      filterSelector: { tags: "$all", displayName: "$in" }
    }
  },
  influenceRadius: {
    type: Number,
    min: 0,
    defaultValue: 0
  },
  tags: {
    type: [String],
    defaultValue: ["untagged"]
  }
  //costs: {
  //  type: [BuildingCostSchema],
  //  optional: true
  //}
});

Presets.attachSchema(PresetSchema);
