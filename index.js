var _ = require('lodash');


function Plugin(options) {
  if(!options.app) {throw Error("No app defined!");}
  var self = this;

  var defaultOptions = {
    options: {},
    app: {}
  };

  self.options = _.extend({}, defaultOptions, options);

  self.webpackIsWatching = false;
  self.serverIsRunning = false;
}

Plugin.prototype.apply = function (compiler) {
  var self = this;

  compiler.plugin('watch-run', function (watching, callback) {
    self.webpackIsWatching = true;
    callback(null, null);
  });

  compiler.plugin('done', function (stats) {
    if (self.webpackIsWatching) {
      if (!self.serverIsRunning) {
        self.serverIsRunning = true;
        self.options.app.run(self.options.options);
      }
    }
  });
};

module.exports = Plugin;
