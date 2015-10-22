Router.configure({
  layoutTemplate: "layout",
  notFoundTemplate: "notFound"
});

Router.route("/", {
  name: "home",
  template: "home"
});

Router.route("/layouts");
Router.route("/designer");
Router.route("/designer/:_id", {
  name: "designer.open",
  action: function () {
    Session.set("designer.layoutId", this.params._id);
    this.render("designer");
  }
});

Router.route("/profile");
