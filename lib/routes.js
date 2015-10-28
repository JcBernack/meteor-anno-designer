Router.configure({
  layoutTemplate: "layout",
  notFoundTemplate: "notFound"
});

Router.route("/", {
  name: "home",
  template: "home"
});

Router.route("/layouts", {
  name: "layout.list",
  template: "layoutList"
});

Router.route("/layout/:_id", {
  name: "layout.view",
  waitOn: function () {
    return Meteor.subscribe("layout", this.params._id);
  },
  action: function () {
    var layout = Layouts.findOne(this.params._id);
    if (layout) {
      this.render("layoutView", { data: layout });
    } else {
      this.render("notFound");
    }
  }
});

Router.route("/designer", {
  name: "designer.open",
  waitOn: function () {
    return Meteor.subscribe("layouts.user", Meteor.userId());
  },
  action: function () {
    var id = Session.get("designer.lastOpenedLayoutId");
    if (id) {
      console.log("selecting last opened layout");
    }
    if (!id) {
      var newestUserLayout = Layouts.findOne({ creator: Meteor.userId() }, { sort: { createdAt: -1 }, limit: 1 });
      if (newestUserLayout){
        id = newestUserLayout._id;
        console.log("selecting newest layout created by current user");
      }
    }
    if (id) {
      //TODO: redirect overwrites browser history... find another way
      this.redirect("designer", { _id: id });
      return;
    }
    if (!Meteor.userId()) {
      this.redirect("layouts");
      return;
    }
    console.log("creating new layout");
    var _this = this;
    Meteor.call("layout.insert", function (err, id) {
      if (err) throw err;
      _this.redirect("designer", { _id: id });
    });
  }
});

Router.route("/designer/:_id", {
  name: "designer",
  waitOn: function () {
    return Meteor.subscribe("layout", this.params._id);
  },
  action: function () {
    var layout = Layouts.findOne(this.params._id);
    if (layout) {
      Session.set("designer.lastOpenedLayoutId", this.params._id);
      this.render("designer", { data: layout });
    } else {
      this.render("notFound");
    }
  }
});

Router.route("/presets", {
  name: "presets",
  template: "presets",
  waitOn: function () {
    return [
      Meteor.subscribe("presets"),
      Meteor.subscribe("icons")
    ];
  }
});

Router.route("/icons", {
  name: "icons",
  template: "icons",
  waitOn: function () {
    return Meteor.subscribe("icons");
  }
});
