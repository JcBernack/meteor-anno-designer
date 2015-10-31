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
      type: "taggedPicker",
      collection: "Icons",
      limit: 5
    }
  },
  influenceRadius: {
    type: Number,
    min: 0,
    defaultValue: 0
  },
  tags: {
    type: [String],
    min: 2,
    max: 32,
    defaultValue: ["untagged"]
  }
  //costs: {
  //  type: [BuildingCostSchema],
  //  optional: true
  //}
}));
