/*
 * grunt-phantomjs-screenshot
 * https://github.com/orangenpresse/grunt-phantomjs-screenshot
 *
 * Copyright (c) 2014 Benedict Burckhart
 * Licensed under the MIT license.
 */

'use strict';

var Screenshooter = require('../bin/Screenshooter');

module.exports = function(grunt) {

	grunt.registerMultiTask('phantomjs_screenshot', 'Takes screenshots of html files with phantomjs', function() {
		var self = this;
		var done = this.async();
		var options = this.options({
			viewport: '1024x768',
			delay: 300,
			quality: 100,
			closeDelay: 1000 // Workaround for https://github.com/ariya/phantomjs/issues/11084
		});

		var screenshooter = new Screenshooter();
		screenshooter.init(grunt, done, options, function() {
			screenshooter.takeScreenshots(self.files);
		});
	});

};