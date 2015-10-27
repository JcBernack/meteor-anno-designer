ColorSchemes = new Mongo.Collection("colorSchemes");

ColorSchemes.attachSchema(new SimpleSchema({
  name: {
    type: String
  },
  warehouse: {
    type: String
  },
  road: {
    type: String
  },
  production: {
    type: [String]
  },
  farm: {
    type: [String]
  },
  field: {
    type: [String]
  }
}));
