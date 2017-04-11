
/**
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

    Screenshooter.prototype.init = function(grunt, done, options, callback) {
      this.grunt = grunt;
      this.done = done;
      this.options = options;
      this.threads = 0;
      return phantom.create(this.getCreateCallback(callback), {
        phantomPath: require('phantomjs').path
      });
    };

    Screenshooter.prototype.takeScreenshot = function(file) {
      var filename;
      this.threads++;
      filename = process.cwd() + '/' + file.src[0];
      if (this.options.server !== '') {
        filename = this.options.server + file.orig.src[0].replace(file.orig.cwd, '');
      }

      return this.ph.createPage(this.getPageCallback((function(_this) {
        return function(page) {
          return page.open(filename, _this.getPageOpenCallback(function() {
            _this.setBackgroundColor(page);
            return setTimeout(function() {
              var destination;
              destination = process.cwd() + '/' + file.dest;
              page.render(destination, {
                quality: _this.options.quality
              });
              _this.setScreenshotDone(destination);
              _this.threads--;
              return page.close();
            }, _this.options.delay);
          }));
        };
      })(this)));
    };

    Screenshooter.prototype.setBackgroundColor = function(page) {
      return page.evaluate(function() {

        /* global document */
        return document.body.bgColor = 'white';
      });
    };

    Screenshooter.prototype.setViewport = function(page, viewport, callback) {
      var resolution;
      resolution = viewport.split(/x/);
      return page.set('viewportSize', {
        width: resolution[0],
        height: resolution[1]
      }, callback);
    };

    Screenshooter.prototype.getCreateCallback = function(callback) {
      return (function(_this) {
        return function(err, ph) {
          if (err === null) {
            _this.ph = ph;
            return callback();
          } else {
            _this.grunt.log.error("PhantomJsCreateError: " + err.msg);
            return _this.done();
          }
        };
      })(this);
    };

    Screenshooter.prototype.getPageCallback = function(callback) {
      return (function(_this) {
        return function(err, page) {
          if (err === null) {
            return _this.setViewport(page, _this.options.viewport, function() {
              return callback(page);
            });
          } else {
            _this.setScreenshotDone();
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

    Screenshooter.prototype.takeScreenshots = function(files) {
      if (files.length === 0) {
        this.grunt.log.ok("No files found");
        this.done();
        return;
      }
      this.screenshotCount = files.length;
      return this.threadSpawner(files);
    };

    Screenshooter.prototype.threadSpawner = function(files) {
      if (this.threads < this.options.maxConcurrent) {
        this.takeScreenshot(files.pop());
      }
      return setTimeout((function(_this) {
        return function() {
          if (files.length > 0) {
            return _this.threadSpawner(files);
          }
        };
      })(this), 100);
    };

    Screenshooter.prototype.setScreenshotDone = function(file) {
      if (file) {
        this.grunt.log.ok("" + file + " saved");
      }
      if (--this.screenshotCount === 0) {
        return setTimeout((function(_this) {
          return function() {
            _this.ph.exit();
            return _this.done();
          };
        })(this), this.options.closeDelay);
      }
    };

    return Screenshooter;

  })();

  module.exports = Screenshooter;

}).call(this);
