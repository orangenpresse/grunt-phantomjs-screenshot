
/* 
 * Screenshooter
 * https://github.com/orangenpresse/grunt-phantomjs-screenshot
 *
 * Copyright (c) 2014 Benedict Burckhart
 * Licensed under the MIT license.
 *
 */

(function() {
  var Screenshooter, phantom;

  phantom = require('node-phantom-simple');

  Screenshooter = (function() {
    function Screenshooter() {}

    Screenshooter.prototype.init = function(grunt, options, callback) {
      this.grunt = grunt;
      this.options = options;
      return phantom.create(this.getCreateCallback(callback), {
        phantomPath: require('phantomjs').path
      });
    };

    Screenshooter.prototype.takeScreenshot = function(file) {
      var filename;
      filename = file.src[0];
      return this.page.open(filename, this.getPageOpenCallback((function(_this) {
        return function() {
          _this.setViewport(_this.options.viewport);
          return setTimeout(function() {
            _this.page.render(file.dest);
            return _this.setScreenshotDone(file);
          }, _this.options.delay);
        };
      })(this)));
    };

    Screenshooter.prototype.setViewport = function(viewport) {
      var resolution;
      resolution = viewport.split(/x/);
      return this.page.viewportSize = {
        width: resolution[0],
        height: resolution[1]
      };
    };

    Screenshooter.prototype.getCreateCallback = function(callback) {
      return (function(_this) {
        return function(err, ph) {
          if (err === null) {
            return ph.createPage(_this.getPageCallback(ph, callback));
          } else {
            return _this.grunt.log.error("PhantomJsCreateError: " + err.msg);
          }
        };
      })(this);
    };

    Screenshooter.prototype.getPageCallback = function(ph, callback) {
      return (function(_this) {
        return function(err, page) {
          if (err === null) {
            _this.page = page;
            return callback();
          } else {
            return _this.grunt.log.error("PageCreateError: " + err.msg);
          }
        };
      })(this);
    };

    Screenshooter.prototype.getPageOpenCallback = function(callback) {
      return (function(_this) {
        return function(err, status) {
          if (err === null && status === 'success') {
            return callback();
          } else {
            _this.setScreenshotDone();
            if (err !== null) {
              return _this.grunt.log.error("PageOpenError: " + err.msg);
            } else {
              return _this.grunt.log.error("PageOpenError: " + status);
            }
          }
        };
      })(this);
    };

    Screenshooter.prototype.takeScreenshots = function(files, done) {
      this.screenshotCount = files.length;
      this.done = done;
      return files.forEach((function(_this) {
        return function(file) {
          return _this.takeScreenshot(file);
        };
      })(this));
    };

    Screenshooter.prototype.setScreenshotDone = function(file) {
      if (file) {
        this.grunt.log.ok("" + file.dest + " saved");
      }
      if (--this.screenshotCount === 0) {
        return this.done();
      }
    };

    return Screenshooter;

  })();

  module.exports = Screenshooter;

}).call(this);
