function intersectsWith(a, b) {
  return !(b.x >= a.x + a.width || b.x + b.width <= a.x || b.y >= a.y + a.height || b.y + b.height <= a.y);
}

function checkCollisions(obj, objects) {
  for (var i = 0; i < objects.length; i++) {
    if (intersectsWith(obj, objects[i])) return true;
  }
  return false;
}

function updateZoom(delta) {
  var viewBox = Session.get("designer.viewBox");
  if (viewBox.width + delta < 16) return;
  viewBox.width += delta;
  viewBox.height += delta;
  Session.set("designer.viewBox", viewBox);
}

Template.layoutDesigner.onCreated(function () {
  // choose initial viewbox such that it fits the bounding box of the layout
  var bb = this.data.boundingBox;
  Session.set("designer.viewBox", {
    x: bb.left - 1,
    y: bb.top - 1,
    width: Math.max(bb.right - bb.left + 2, 40),
    height: Math.max(bb.bottom - bb.top + 2, 30)
  });
});

Template.layoutDesigner.helpers({
  gridInterval: function () {
    //TODO: use session variable?
    return 2;
  },
  gridEnabled: function () {
    //TODO: use session variable?
    return true;
  },
  placementActive: function () {
    return Session.get("designer.placementActive");
  },
  placementObject: function () {
    var obj = Session.get("designer.placementObject");
    obj.x = Session.get("designer.x");
    obj.y = Session.get("designer.y");
    return obj;
  },
  collision: function (obj) {
    if (checkCollisions(obj, Template.instance().data.objects)) {
      return "layout-object-collision";
    }
  },
  viewBox: function () {
    var viewBox = Session.get("designer.viewBox");
    return {
      viewBox: [
        viewBox.x, " ",
        viewBox.y, " ",
        viewBox.width, " ",
        viewBox.height
      ]
    };
  },
  gridPosition: function () {
    var viewBox = Session.get("designer.viewBox");
    return {
      x: viewBox.x,
      y: viewBox.y
    }
  }
});

Template.layoutDesigner.events({
  "mousemove .layout-render": function (event, template) {
    // bail out if placement is not active
    if (Session.equals("designer.placementActive", false)) return;
    // transform the mouse position to svg view-box coordinates
    var svg = template.find("svg");
    var pt = svg.createSVGPoint();
    pt.x = event.clientX;
    pt.y = event.clientY;
    pt = pt.matrixTransform(svg.getScreenCTM().inverse());
    // center the object on the mouse
    var obj = Session.get("designer.placementObject");
    pt.x = Math.round(pt.x - obj.width / 2);
    pt.y = Math.round(pt.y - obj.height / 2);
    // update only if anything changed to reduce the number of redraws
    if (pt.x != Session.get("designer.x") || pt.y != Session.get("designer.y")) {
      //console.log("mousemove: " + pt.x + " " + pt.y);
      Session.set("designer.x", pt.x);
      Session.set("designer.y", pt.y);
    }
  },

  "click .layout-render": function (event, template) {
    if (Session.equals("designer.placementActive", false)) return;
    var obj = Session.get("designer.placementObject");
    obj.x = Session.get("designer.x");
    obj.y = Session.get("designer.y");
    if (checkCollisions(obj, this.objects)) {
      console.log("add object failed: collision detected");
      return;
    }
    Meteor.call("layout.object.add", this._id, obj);
  },

  "dblclick .layout-object": function (event) {
    if (Session.equals("designer.placementActive", true)) return;
    var obj = _.clone(this);
    delete obj.x;
    delete obj.y;
    console.log("copy object:", obj);
    Session.set("designer.placementObject", obj);
    Session.set("designer.placementActive", true);
  },

  "mousedown, contextmenu": function (event) {
    // prevent selection of text when (double) clicking
    // and suppress context menu
    event.preventDefault();
  },

  "contextmenu .layout-render": function () {
    if (Session.equals("designer.placementActive", false)) return;
    Session.set("designer.placementActive", false);
    console.log("placement stopped");
  },

  "contextmenu .layout-object": function (event, template) {
    if (Session.equals("designer.placementActive", true)) return;
    Meteor.call("layout.object.remove", template.data._id, this);
  }
});

Template.layoutToolbar.events({
  "click button.toolbar-new": function () {
    Meteor.call("layout.insert", function (err, id) {
      if (err) throw err;
      Router.go("designer", { _id: id });
    });
  },
  "click button.toolbar-zoom-in": function () {
    updateZoom(-4);
  },
  "click button.toolbar-zoom-out": function () {
    updateZoom(4);
  },
  "click button.toolbar-rotate-cw": function () {
    Meteor.call("layout.transform", this._id, 1, false);
  },
  "click button.toolbar-rotate-ccw": function () {
    Meteor.call("layout.transform", this._id, -1, false);
  },
  "click button.toolbar-flip-vertical": function () {
    Meteor.call("layout.transform", this._id, 0, true);
  },
  "click button.toolbar-flip-horizontal": function () {
    Meteor.call("layout.transform", this._id, 2, true);
  }
});
