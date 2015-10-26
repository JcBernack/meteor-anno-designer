Meteor.startup(function () {
  Session.setDefault("designer.placementActive", false);
  Session.setDefault("designer.placementObject", {
    width: 4, height: 4, color: "#ff0000"
  });
});

function intersectsWith(a, b) {
  return !(b.x >= a.x + a.width || b.x + b.width <= a.x || b.y >= a.y + a.height || b.y + b.height <= a.y);
}

function checkCollisions(obj, objects) {
  for (var i = 0; i < objects.length; i++) {
    if (intersectsWith(obj, objects[i])) return true;
  }
  return false;
}

Template.layoutDesigner.onCreated(function () {
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
    return Session.get("designer.placementObject");
  },
  collision: function () {
    if (checkCollisions(this, Template.instance().data.objects)) {
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
    if (pt.x != obj.x || pt.y != obj.y) {
      //console.log("mousemove: " + pt.x + " " + pt.y);
      obj.x = pt.x;
      obj.y = pt.y;
      Session.set("designer.placementObject", obj);
    }
  },

  "click .layout-render": function (event, template) {
    if (Session.equals("designer.placementActive", false)) return;
    var obj = Session.get("designer.placementObject");
    if (checkCollisions(obj, this.objects)) {
      console.log("add object failed: collision detected");
      return;
    }
    Meteor.call("layout.objects.add", this._id, obj);
  },

  "dblclick .layout-object": function (event) {
    if (Session.equals("designer.placementActive", true)) return;
    console.log("copy object:");
    console.log(this);
    Session.set("designer.placementObject", this);
    Session.set("designer.placementActive", true);
    return false;
  },

  "mousedown .layout-object": function (event) {
    // prevent selection of text when double clicking
    event.preventDefault();
  },

  "contextmenu .layout-render": function (event) {
    if (Session.equals("designer.placementActive", false)) return;
    event.preventDefault();
    Session.set("designer.placementActive", false);
    console.log("placement stopped");
  },

  "contextmenu .layout-object": function (event, template) {
    if (Session.equals("designer.placementActive", true)) return;
    event.preventDefault();
    Meteor.call("layout.objects.remove", template.data._id, this);
  },

  "mousewheel": function (event) {
    event.preventDefault();
    //TODO: make sure this works in all browsers
    var delta = event.originalEvent.wheelDelta / 120 * 2;
    var viewBox = Session.get("designer.viewBox");
    if (viewBox.width + delta < 16) return;
    viewBox.width += delta;
    viewBox.height += delta;
    Session.set("designer.viewBox", viewBox);
  }
});
