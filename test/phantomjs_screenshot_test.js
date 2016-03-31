'use strict';

var grunt = require('grunt');

exports.phantomjs_screenshot = {
  setUp: function(done) {
    done();
  },
  default_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/default_options/test.png');
    var expected = grunt.file.read('test/expected/default_options/test.png');
    test.equal(actual, expected, 'should render png files with default_options');

    test.done();
  },
  custom_options: function(test) {
    test.expect(1);

    var actual = grunt.file.read('tmp/custom_options/index.jpg');
    var expected = grunt.file.read('test/expected/custom_options/test.jpg');
    test.equal(actual, expected, 'should render jpg files with custom_options and low quality');

    test.done();
  }
};