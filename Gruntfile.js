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
				'src/*.js',
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
				options: {},
				files: [{
					expand: true,
					cwd: 'test/fixtures',
					src: ['**/*.html'],
					dest: 'tmp/default_options',
					ext: '.png'
				}]
			},
			custom_options: {
				options: {
					viewport: '1920x1080',
					quality: 0,
					closeDelay: 500,
					clearMemoryCache: true,
					phantomStartParameters: {"load-images":"false"}
				},
				files: {
					'tmp/custom_options/index.jpg': ['test/fixtures/test.html']
				}
			},
			empty_folder: {
				options: {},
				files: [{
					expand: true,
					cwd: 'test/fixtures',
					src: ['**/*.notExists'],
					dest: 'tmp/empty_folder',
					ext: '.png'
				}]
			}
		},

		// Unit tests.
		nodeunit: {
			tests: ['test/*_test.js']
		},

		// Build coffee scripts
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