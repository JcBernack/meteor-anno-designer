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
Router.route("/profile");
