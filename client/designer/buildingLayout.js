Template.buildingLayout.helpers({
  id: function () {
    return this._id;
  },
  gridFactor: function () {
    return this.gridFactor || 2;
  },
  gridSize: function () {
    return this.gridSize || 20;
  },
  hover: function () {
    return Template.parentData().hover ? "building-hover" : undefined;
  }
});
