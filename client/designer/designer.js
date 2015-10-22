Meteor.startup(function () {
  Session.setDefault("designer.gridSize", 20);
  Session.setDefault("designer.gridFactor", 2);
  Session.setDefault("designer.placementActive", false);
  Session.setDefault("designer.placementObject", {
    width: 4, height: 4, color: "#ff0000"
  });
});

function newLayout() {
  var layoutId = Layouts.insert({
    creator: Meteor.userId(),
    createdAt: new Date(),
    objects: []
  });
  Session.set("designer.layoutId", layoutId);
  console.log("new layout: " + layoutId);
}

Template.designer.onCreated(function () {
  this.subscribe("layouts", function() {
    var layout = Layouts.findOne(Session.get("designer.layoutId"));
    if (!layout){
      layout = Layouts.findOne({ creator: Meteor.userId() }, { sort: { createdAt: -1 }, limit: 1 });
    }
    if (layout) {
      Session.set("designer.layoutId", layout._id);
    } else {
      newLayout();
    }
  });
});

Template.designerSurface.helpers({
  gridSize: function () {
    return Session.get("designer.gridSize");
  },
  gridFactor: function () {
    return Session.get("designer.gridFactor");
  },
  layout: function () {
    return Layouts.findOne(Session.get("designer.layoutId"));
  },
  placementActive: function () {
    return Session.get("designer.placementActive");
  },
  placementObject: function () {
    return Session.get("designer.placementObject");
  }
});

Template.designerSurface.events({
  "mousemove svg": function (event) {
    // bail out if placement is not active
    if (Session.equals("designer.placementActive", false)) return;
    var obj = Session.get("designer.placementObject");
    var scale = Session.get("designer.gridSize");
    // calculate mouse position relative to svg element
    //var parentOffset = $(event.delegateTarget).offset();
    //var x = event.pageX - parentOffset.left;
    //var y = event.pageY - parentOffset.top;
    //TODO: make sure this works in all browsers
    var x = event.offsetX;
    var y = event.offsetY;
    // center object on mouse
    x -= obj.width * scale / 2;
    y -= obj.height * scale / 2;
    // scale to grid coordinates
    x = Math.round(x / scale);
    y = Math.round(y / scale);
    // move placement object to calculated position
    obj.x = x;
    obj.y = y;
    Session.set("designer.placementObject", obj);
    //console.log("moved to (" + x + "," + y + ")");
  },
  "click svg": function (event) {
    if (Session.equals("designer.placementActive", false)) return;
    Layouts.update(Session.get("designer.layoutId"), { $push: { objects: Session.get("designer.placementObject") } });
    console.log("object added:");
    console.log(Session.get("designer.placementObject"));
  },
  "contextmenu svg": function (event) {
    if (Session.equals("designer.placementActive", false)) return;
    event.preventDefault();
    Session.set("designer.placementActive", false);
    console.log("placement stopped");
  },
  "mousewheel": function (event) {
    //TODO: make sure this works in all browsers
    Session.set("designer.gridSize", Session.get("designer.gridSize") + event.originalEvent.wheelDelta / 120 * 2);
    console.log("grid size: " + Session.get("designer.gridSize"));
  }
});

Template.layoutSettings.events({
  "click button.new": function () {
    newLayout();
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
      width: event.target.width.value,
      height: event.target.height.value,
      color: event.target.color.value
    });
    Session.set("designer.placementActive", true);
    console.log("placement started");
  }
});
