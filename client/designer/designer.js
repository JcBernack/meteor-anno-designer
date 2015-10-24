Meteor.startup(function () {
  Session.setDefault("designer.gridSize", 20);
  Session.setDefault("designer.gridFactor", 2);
  Session.setDefault("designer.placementActive", false);
  Session.setDefault("designer.placementObject", {
    width: 4, height: 4, color: "#ff0000"
  });
});

function checkCollisions(obj, template) {
  var scale = Session.get("designer.gridSize");
  var svg = template.find("svg");
  var rect = svg.createSVGRect();
  var margin = 0.5;
  rect.x = (obj.x + margin) * scale;
  rect.y = (obj.y + margin) * scale;
  rect.width = (obj.width - 2 * margin) * scale;
  rect.height = (obj.height - 2 * margin) * scale;
  var collisions = svg.getIntersectionList(rect, template.find(".layoutObjects"));
  return collisions.length;
}

Template.designerSurface.helpers({
  surfaceHeight: function () {
    return 600;
  },
  gridSize: function () {
    return Session.get("designer.gridSize");
  },
  gridFactor: function () {
    return Session.get("designer.gridFactor");
  },
  placementActive: function () {
    return Session.get("designer.placementActive");
  },
  placementObject: function () {
    return Session.get("designer.placementObject");
  },
  stroke: function () {
    var collisions = checkCollisions(Session.get("designer.placementObject"), Template.instance());
    return collisions > 0 ? "#ff0000" : "#00ff00";
  }
});

Template.designerSurface.events({
  "mousemove svg": function (event, template) {
    // bail out if placement is not active
    if (Session.equals("designer.placementActive", false)) return;
    // scale mouse position to grid coordinates and center the object on that position
    var scale = Session.get("designer.gridSize");
    var obj = Session.get("designer.placementObject");
    //TODO: make sure this works in all browsers
    obj.x = Math.round(event.offsetX / scale - obj.width / 2);
    obj.y = Math.round(event.offsetY / scale - obj.height / 2);
    Session.set("designer.placementObject", obj);
  },

  "click svg": function (event, template) {
    if (Session.equals("designer.placementActive", false)) return;
    var obj = Session.get("designer.placementObject");
    var collisions = checkCollisions(obj, template);
    if (collisions) {
      console.log("add object failed: " + collisions + " collisions detected");
      return;
    }
    console.log("add object:");
    console.log(obj);
    Meteor.call("layout.objects.add", this.layout._id, obj);
  },

  "dblclick .building": function (event) {
    if (Session.equals("designer.placementActive", true)) return;
    console.log("copy object:");
    console.log(this);
    Session.set("designer.placementObject", this);
    Session.set("designer.placementActive", true);
    return false;
  },

  "mousedown .building": function (event) {
    // prevent selection of text when double clicking
    event.preventDefault();
  },

  "contextmenu svg": function (event) {
    if (Session.equals("designer.placementActive", false)) return;
    event.preventDefault();
    Session.set("designer.placementActive", false);
    console.log("placement stopped");
  },

  "contextmenu .building": function (event) {
    if (Session.equals("designer.placementActive", true)) return;
    event.preventDefault();
    console.log("remove object:");
    console.log(this);
    Meteor.call("layout.objects.remove", Template.currentData()._id, this);
  },

  "mousewheel": function (event) {
    event.preventDefault();
    //TODO: make sure this works in all browsers
    var scale = Session.get("designer.gridSize") + event.originalEvent.wheelDelta / 120 * 2;
    if (scale < 6) scale = 6;
    Session.set("designer.gridSize", scale);
    console.log("grid size: " + scale);
  },

  "mouseover .building": function (event) {
    if (Session.equals("designer.placementActive", true)) return;
    event.currentTarget.parentNode.appendChild(event.currentTarget);
  }
});

Template.layoutDetails.helpers({
  width: function () {
    var bb = this.boundingBox;
    return bb.right - bb.left;
  },
  height: function () {
    var bb = this.boundingBox;
    return bb.bottom - bb.top;
  }
});

Template.layoutDetails.events({
  "click button.new": function () {
    console.log("creating new layout");
    Meteor.call("layout.insert", function (err, id) {
      if (err) throw err;
      Router.go("designer", { _id: id });
    });
  }
});

Template.buildingSettings.helpers({
  get: function (property) {
    return Session.get("designer.placementObject")[property];
  }
});

Template.buildingSettings.events({
  "submit form": function (event) {
    event.preventDefault();
    Session.set("designer.placementObject", {
      width: Number.parseInt(event.target.width.value),
      height: Number.parseInt(event.target.height.value),
      color: event.target.color.value
    });
    Session.set("designer.placementActive", true);
    console.log("placement started");
  }
});
