Router.configure({
  layoutTemplate: "layout",
  notFoundTemplate: "notFound"
});

Router.route("/", {
  name: "home",
  template: "home"
});

Router.route("/layouts");
Router.route("/designer", {
  name: "designer.open",
  waitOn: function () {
    return Meteor.subscribe("layouts.user", Meteor.userId());
  },
  action: function () {
    var id = Session.get("designer.layoutId");
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
  template: "designer",
  waitOn: function () {
    return Meteor.subscribe("layout", this.params._id);
  },
  data: function () {
    var layout = Layouts.findOne(this.params._id);
    if (!layout) {
      this.render("notFound");
    } else {
      return layout;
    }
  },
  action: function () {
    Session.set("designer.layoutId", this.params._id);
    this.render();
  }
});

Router.route("/profile");
