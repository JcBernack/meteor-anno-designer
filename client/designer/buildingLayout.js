function getGridSize(layout, element) {
  var bb = layout.boundingBox;
  var width = 2 + bb.right - bb.left;
  var height = 2 + bb.bottom - bb.top;
  var gx = element.offsetWidth / width;
  var gy = element.offsetHeight / height;
  return Math.min(gx, gy);
}

Template.buildingLayout.onCreated(function () {
  this.gridSize = new ReactiveVar(this.data.gridSize || 20);
  //TODO: layouts need to be normalized to be correctly centered in view
});

Template.buildingLayout.onRendered(function () {
  if (this.data.autoSize) {
    this.gridSize.set(getGridSize(this.data.layout, this.find("svg")));
  }
});

Template.buildingLayout.helpers({
  id: function () {
    return this._id;
  },
  gridFactor: function () {
    return this.gridFactor || 2;
  },
  gridSize: function () {
    return Template.instance().gridSize.get();
  },
  hover: function () {
    return Template.parentData().hover ? "building-hover" : undefined;
  }
});
