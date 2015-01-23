var aggressiveInline = require('aggressive-inline');
var gutil = require('gulp-util');
var through = require('through2');

var pluginName = 'gulp-aggressive-inline';

module.exports = function gulpAggressiveInline(options) {
  var stream = through.obj(function(file, enc, cb) {

    if (file.isNull() || file.isDirectory()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError(pluginName, 'Streaming not supported'));
      return cb();
    }

    try {
      options = options || {};
      var filePath = file.path;
      options.rootpath = options.rootpath || filePath;

      var that = this;
      aggressiveInline(options.rootpath, file.contents.toString(), true, function (err, content) {
        file.contents = new Buffer(content);
        that.push(file);
        cb(null, file);
      });
    } catch (err) {
      this.emit('error', new gutil.PluginError(pluginName, err));
    }
  });

  return stream;
};
