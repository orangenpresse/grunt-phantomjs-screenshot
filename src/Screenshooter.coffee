### 
# Screenshooter
# https://github.com/orangenpresse/grunt-phantomjs-screenshot
#
# Copyright (c) 2014 Benedict Burckhart
# Licensed under the MIT license.
#
###
phantom = require('node-phantom-simple');

class Screenshooter
	init: (@grunt, @options, callback) ->
		phantom.create @getCreateCallback(callback), {
			phantomPath: require('phantomjs').path
		}

	takeScreenshot: (file) ->
		# use only first source filename
		filename = file.src[0]

		@page.open filename, @getPageOpenCallback =>
			@setViewport @options.viewport
			setTimeout( =>
				@page.render file.dest
				@setScreenshotDone file
			, @options.delay)

	setViewport: (viewport) ->
		resolution = viewport.split /x/
		@page.viewportSize = {
			width: resolution[0],
			height: resolution[1]
		}

	getCreateCallback: (callback) ->
		return (err, ph) =>
			if err is null
				ph.createPage @getPageCallback(ph, callback)
			else
				@grunt.log.error "PhantomJsCreateError: #{err.msg}"

	getPageCallback: (ph, callback) ->
		return (err, page) =>
			if err is null
				@page = page;
				callback()
			else
				@grunt.log.error "PageCreateError: #{err.msg}"
			
	getPageOpenCallback: (callback) ->
		return (err, status) =>
			if err is null and status is 'success'
				callback()
			else
				@setScreenshotDone()
				if err isnt null
					@grunt.log.error "PageOpenError: #{err.msg}"
				else
					@grunt.log.error "PageOpenError: #{status}"

	takeScreenshots: (files, done) ->
		@screenshotCount = files.length;
		@done = done;
		files.forEach (file) =>
			@takeScreenshot(file);

	setScreenshotDone: (file) ->
		if file
			@grunt.log.ok "#{file.dest} saved"
		if --@screenshotCount is 0
			@done()

module.exports = Screenshooter