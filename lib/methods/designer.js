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
    var id = Layouts.insert({
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
    console.log("created new layout: " + id);
    return id;
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
    check(id, String);
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
    check(id, String);
    var layout = Layouts.findOne(id);
    //TODO: validate obj
    if (layout) {
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
  },

  "layout.normalize": function (id) {
    check(id, String);
    var layout = Layouts.findOne(id);
    if (!layout) throw new Meteor.Error(404, "Not Found");
    for (var i = 0; i < layout.objects.length; i++) {
      var o = layout.objects[i];
      o.x += 1 - layout.boundingBox.left;
      o.y += 1 - layout.boundingBox.top;
    }
    layout.boundingBox = calculateBoundingBox(layout.objects);
    Layouts.update(id, { $set: { objects: layout.objects, boundingBox: layout.boundingBox } });
  },

  "layout.transform": function (id, rotate, flip) {
    check(id, String);
    check(rotate, Number);
    check(flip, Boolean);
    if (Math.abs(rotate) > 3) throw new Meteor.Error(400, "Bad request");
    var layout = Layouts.findOne(id);
    if (!layout) throw new Meteor.Error(404, "Not Found");
    var tx = Math.cos(Math.PI / 2 * rotate);
    var ty = Math.sin(Math.PI / 2 * rotate);
    var tf = flip ? -1 : 1;
    for (var i = 0; i < layout.objects.length; i++) {
      var o = layout.objects[i];
      var x = tx * o.x - ty * tf * o.y;
      var y = ty * o.x + tx * tf * o.y;
      var w = tx * o.width - ty * tf * o.height;
      var h = ty * o.width + tx * tf * o.height;
      if (w < 0) x += w;
      if (h < 0) y += h;
      o.x = Math.round(x);
      o.y = Math.round(y);
      o.width = Math.round(Math.abs(w));
      o.height = Math.round(Math.abs(h));
    }
    layout.boundingBox = calculateBoundingBox(layout.objects);
    Layouts.update(id, { $set: { objects: layout.objects, boundingBox: layout.boundingBox } });
    Meteor.call("layout.normalize", id);
  }
});
