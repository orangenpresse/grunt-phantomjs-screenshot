(function() {
  var Screenshooter, phantom;

  phantom = require('node-phantom-simple');

  Screenshooter = (function() {
    function Screenshooter() {}

    Screenshooter.prototype.init = function(options, callback) {
      return phantom.create(this.getCreateCallback(callback), {
        phantomPath: require('phantomjs').path
      });
    };

    Screenshooter.prototype.takeScreenshot = function(file) {
      var e, filename;
      filename = file.src[0];
      try {
        return this.page.open(filename, this.getPageOpenCallback((function(_this) {
          return function() {
            return _this.page.render(file.dest);
          };
        })(this)));
      } catch (_error) {
        e = _error;
        return console.log("MEEP");
      }
    };

    Screenshooter.prototype.getCreateCallback = function(callback) {
      return (function(_this) {
        return function(err, ph) {
          return ph.createPage(_this.getPageCallback(ph, callback));
        };
      })(this);
    };

    Screenshooter.prototype.getPageCallback = function(ph, callback) {
      return (function(_this) {
        return function(err, page) {
          _this.page = page;
          return callback();
        };
      })(this);
    };

    Screenshooter.prototype.getPageOpenCallback = function(callback) {
      return function(err, status) {
        throw 'test';
      };
    };

    return Screenshooter;

  })();

  module.exports = Screenshooter;

}).call(this);
