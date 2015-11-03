Router.configure({
  layoutTemplate: "layout",
  notFoundTemplate: "errorNotFound"
});

Router.route("/", {
  name: "home",
  template: "home"
});

Router.route("/layouts", {
  name: "layout.list",
  template: "layoutList",
  waitOn: function () {
    return [
      Meteor.subscribe("layouts"),
      Meteor.subscribe("icons"),
      Meteor.subscribe("users")
    ];
  }
});

Router.route("/layout/:_id", {
  name: "layout.view",
  waitOn: function () {
    return [
      Meteor.subscribe("layout", this.params._id),
      Meteor.subscribe("layoutComments", this.params._id),
      Meteor.subscribe("icons"),
      Meteor.subscribe("users")
    ];
  },
  action: function () {
    var layout = Layouts.findOne(this.params._id);
    if (layout) {
      this.render("layoutView", { data: layout });
    } else {
      this.render("errorNotFound");
    }
  }
});

Router.route("/designer", {
  name: "designer.open",
  waitOn: function () {
    return Meteor.subscribe("layouts.user");
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
    console.log("creating new layout");
    var self = this;
    Meteor.call("layout.insert", function (err, id) {
      if (err) throw err;
      self.redirect("designer", { _id: id });
    });
  }
});

Router.route("/designer/:_id", {
  name: "designer",
  waitOn: function () {
    return [
      Meteor.subscribe("layout", this.params._id),
      Meteor.subscribe("icons"),
      Meteor.subscribe("presets")
    ];
  },
  action: function () {
    var layout = Layouts.findOne(this.params._id);
    if (layout) {
      Session.set("designer.lastOpenedLayoutId", this.params._id);
      this.render("designer", { data: layout });
    } else {
      this.render("errorNotFound");
    }
  }
});

Router.route("/presets", {
  name: "presets",
  template: "presets",
  subscriptions: function () {
    return [
      Meteor.subscribe("presets"),
      Meteor.subscribe("icons")
    ];
  }
});

Router.route("/icons", {
  name: "icons",
  template: "icons",
  subscriptions: function () {
    return Meteor.subscribe("icons");
  }
});

Router.route("/users", {
  name: "users",
  template: "users",
  subscriptions: function () {
    return [
      Meteor.subscribe("userdata"),
      Meteor.subscribe("roles")
    ];
  }
});

// render "forbidden" error if the user is not logged in or in the given role
function requireUser(roles) {
  return function () {
    if (Meteor.loggingIn()){
      this.render("loading");
    } else if (!Meteor.userId() || (roles && !Roles.userIsInRole(Meteor.userId(), roles))) {
      this.render("errorForbidden");
    } else {
      this.next();
    }
  };
}

// access restricted urls
Router.before(requireUser(), { only: ["designer.open", "designer"] });
Router.before(requireUser("useradmin"), { only: ["users"] });
Router.before(requireUser("presets"), { only: ["presets"] });
Router.before(requireUser("icons"), { only: ["icons"] });
