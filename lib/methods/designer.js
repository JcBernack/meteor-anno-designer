function calculateBoundingBox(objects) {
  if (objects.length == 0) return {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  };
  var obj = objects[0];
  var bb = {
    left: obj.x,
    top: obj.y,
    right: obj.x + obj.width,
    bottom: obj.y + obj.height
  };
  for (var i = 1; i < objects.length; i++) {
    var o = objects[i];
    if (o.x < bb.left) bb.left = o.x;
    if (o.y < bb.top) bb.top = o.y;
    if (o.x + o.width > bb.right) bb.right = o.x + o.width;
    if (o.y + o.height > bb.bottom) bb.bottom = o.y + o.height;
  }
  return bb;
}

Meteor.methods({
  "layout.insert": function () {
    if (!Meteor.userId()) throw new Meteor.Error(401, "Unauthorized");
    return Layouts.insert({
      creator: Meteor.userId(),
      createdAt: new Date(),
      objects: [],
      boundingBox: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
      }
    });
  },

  "layout.remove": function (id) {
    check(id, String);
    if (!Meteor.userId()) throw new Meteor.Error(401, "Unauthorized");
    var layout = Layouts.findOne(id);
    if (!layout) throw new Meteor.Error(404, "Not Found");
    if (layout.creator !== this.userId) throw new Meteor.Error(403, "Forbidden");
    Layouts.remove(id);
  },

  "layout.objects.add": function (id, obj) {
    var layout = Layouts.findOne(id);
    if (!layout) throw new Meteor.Error(404, "Not Found");
    //TODO: validate obj
    //TODO: repeat collision detection server-side
    layout.objects.push(obj);
    var bb = calculateBoundingBox(layout.objects);
    console.log("new bounding box:");
    console.log(bb);
    Layouts.update(id, { $push: { objects: obj }, $set: { boundingBox: bb } });
  },

  "layout.objects.remove": function (id, obj) {
    var layout = Layouts.findOne(id);
    //TODO: validate obj
    if (layout){
      var o = _.find(layout.objects, function (o) {
        return _.isEqual(o, obj);
      });
      var index = layout.objects.indexOf(o);
    }
    if (!layout || index < 0) throw new Meteor.Error(404, "Not Found");
    layout.objects.splice(index, 1);
    var bb = calculateBoundingBox(layout.objects);
    console.log("new bounding box:");
    console.log(bb);
    Layouts.update(id, { $pull: { objects: obj }, $set: { boundingBox: bb } });
  }
});
