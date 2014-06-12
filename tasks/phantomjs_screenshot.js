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

		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			viewport: '1024x768',
			delay: 300
		});

		var screenshooter = new Screenshooter();
		screenshooter.init(grunt, options, function() {
			screenshooter.takeScreenshots(self.files, function() {
				done();
			});
		});
	});

};