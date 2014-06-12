/*
 * grunt-phantomjs-screenshot
 * https://github.com/orangenpresse/grunt-phantomjs-screenshot
 *
 * Copyright (c) 2014 Benedict Burckhart
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js',
				'<%= nodeunit.tests %>'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: ['tmp']
		},

		// Configuration to be run (and then tested).
		phantomjs_screenshot: {
			default_options: {
				options: {
					viewport: '1024x768',
					delay: 300
				},
				files: [{
					expand: true,
					flatten: false,
					cwd: 'test/fixtures',
					src: ['**/*.html'],
					dest: 'tmp',
					ext: '.png'
				}]
			},
			custom_options: {
				options: {
					separator: ': ',
					punctuation: ' !!!'
				},
				files: [{
					expand: true,
					flatten: false,
					cwd: 'test/fixtures',
					src: ['**/*.html'],
					dest: 'tmp',
					ext: '.png'
				}]
			}
		},

		// Unit tests.
		nodeunit: {
			tests: ['test/*_test.js']
		},

		coffee: {
			build: {
				expand: true,
				flatten: false,
				cwd: 'src',
				src: ['**/*.coffee'],
				dest: 'bin',
				ext: '.js'
			}
		}

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-coffee');

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', ['clean', 'phantomjs_screenshot', 'nodeunit']);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['coffee:build', 'jshint', 'test']);

	grunt.registerTask('build', ['coffee:build']);

};