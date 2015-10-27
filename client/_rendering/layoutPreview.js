Template.layoutPreview.helpers({
  gridInterval: function () {
    //TODO: use session variable?
    return 2;
  },
  gridEnabled: function () {
    //TODO: use session variable?
    return true;
  },
  viewBox: function () {
    var bb = this.boundingBox;
    return {
      x: bb.left - 1,
      y: bb.top - 1,
      width: bb.right - bb.left + 2,
      height: bb.bottom - bb.top + 2
    };
  }
});
