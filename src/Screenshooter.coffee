###*
# Screenshooter
# https://github.com/orangenpresse/grunt-phantomjs-screenshot
#
# Copyright (c) 2014 Benedict Burckhart
# Licensed under the MIT license.
#
###

phantom = require('node-phantom-simple')

class Screenshooter
	init: (@grunt, @done, @options, callback) ->
		@threads = 0
		phantom.create @getCreateCallback(callback), {
			phantomPath: require('phantomjs').path
		}

	takeScreenshot: (file) ->
		@threads++
		# use only first source filename
		filename = process.cwd() + '/' + file.src[0]

		@ph.createPage @getPageCallback (page) =>
			page.open filename, @getPageOpenCallback =>
				@setBackgroundColor(page)
				setTimeout =>
					destination = process.cwd() + '/' + file.dest
					page.render destination, {quality: @options.quality}
					@setScreenshotDone destination
					@threads--
					page.close()
				, @options.delay

	setBackgroundColor: (page) ->
		page.evaluate ->
			### global document ###
			document.body.bgColor = 'white'

	setViewport: (page, viewport, callback) ->
		resolution = viewport.split /x/
		page.set 'viewportSize', {
			width: resolution[0],
			height: resolution[1]
		}, callback

	getCreateCallback: (callback) ->
		return (err, ph) =>
			if err is null
				@ph = ph
				callback()
			else
				@grunt.log.error "PhantomJsCreateError: #{err.msg}"
				@done()

	getPageCallback: (callback) ->
		return (err, page) =>
			if err is null
				@setViewport page, @options.viewport, =>
					callback(page)
			else
				@setScreenshotDone()
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

	takeScreenshots: (files) ->
		@screenshotCount = files.length
		@threadSpawner files

	threadSpawner: (files) ->
		if files.length is 0
			return

		if @threads < @options.maxConcurrent
			@takeScreenshot files.pop()

		setTimeout =>
			@threadSpawner files
		, 100

	setScreenshotDone: (file) ->
		if file
			@grunt.log.ok "#{file} saved"
		if --@screenshotCount is 0
			# Workaround for https://github.com/ariya/phantomjs/issues/11084
			setTimeout =>
				@ph.exit()
				@done()
			, @options.closeDelay

module.exports = Screenshooter