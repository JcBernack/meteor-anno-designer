Package.describe({
  name: "jcbernack:tag-input",
  version: "0.0.5",
  // Brief, one-line summary of the package.
  summary: "Tag input control.",
  // URL to the Git repository containing the source code for this package.
  git: "https://github.com/JcBernack/meteor-tags",
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: "README.md"
});

Package.onUse(function(api) {
  api.versionsFrom("1.2.1");
  api.use([
    "templating",
    "reactive-var",
    "underscore",
    "jquery"]);
  api.addFiles("tag-input.css", "client");
  api.addFiles("tag-input.html", "client");
  api.addFiles("tag-input.js", "client");
});

//Package.onTest(function(api) {
//  api.use("ecmascript");
//  api.use("tinytest");
//  api.use("jcbernack:tags");
//  api.addFiles("tags-tests.js");
//});
