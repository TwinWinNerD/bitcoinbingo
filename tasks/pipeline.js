/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */



// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [
  'js/dependencies/jquery/jquery-2.1.1.min.js',
  'dependencies/angular/angular.js',
  'dependencies/lodash/dist/lodash.js',
  'dependencies/ladda/js/spin.js',
  'dependencies/ladda/js/ladda.js',
  'dependencies/angular-ladda/dist/angular-ladda.min.js',
  'dependencies/angular-cookies/angular-cookies.js',
  'dependencies/angular-ui-router/release/angular-ui-router.js',
  'dependencies/angular-growl-notifications/dist/angular-growl-notifications.js',
  'js/dependencies/plugins/jquery-ui/jquery-ui.js',
  'js/dependencies/bootstrap/bootstrap.js',
  'js/dependencies/plugins/metisMenu/jquery.metisMenu.js',
  'js/dependencies/plugins/pace/pace.min.js',
  'js/dependencies/plugins/slimscroll/jquery.slimscroll.min.js',
  'js/dependencies/inspinia.js',
  'dependencies/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',

  'js/dependencies/bootstrap/ui-bootstrap-tpls-0.11.0.min.js',

  'js/dependencies/sails.io.js',
  'js/dependencies/ngsails.io.js',

  'js/app/app.js',
  'js/app/config.js',
  'js/app/services/*.js',
  'js/app/filters/*.js',
  'js/app/controllers/*.js',
  'js/app/directives.js',
];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  'templates/**/*.html'
];


// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function (path) {
  return '.tmp/public/' + path;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function (path) {
  return '.tmp/public/' + path;
});
module.exports.templateFilesToInject = templateFilesToInject.map(function (path) {
  return 'assets/' + path;
});
