Package.describe({
  name: "jcbernack:filtered-picker",
  version: "0.0.5",
  // Brief, one-line summary of the package.
  summary: "Searchable picker for collection elements.",
  // URL to the Git repository containing the source code for this package.
  git: "",
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
  api.addFiles("filtered-picker.html", "client");
  api.addFiles("filtered-picker.css", "client");
  api.addFiles("filtered-picker.js", "client");
});

//Package.onTest(function(api) {
//  api.use("ecmascript");
//  api.use("tinytest");
//  api.use("jcbernack:filtered-picker");
//  api.addFiles("filtered-picker-tests.js");
//});
