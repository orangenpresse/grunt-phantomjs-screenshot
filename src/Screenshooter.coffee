phantom = require('node-phantom-simple');

class Screenshooter
	init: (options, callback) ->
		phantom.create(
			@getCreateCallback(callback),
			{
				phantomPath: require('phantomjs').path
			}
		)

	takeScreenshot: (file) ->
		filename = file.src[0]
		@page.open(
			filename,  
			@getPageOpenCallback =>
				@page.render(file.dest);
		)
			
	getCreateCallback: (callback) ->
		return (err, ph) =>
			return ph.createPage @getPageCallback(ph, callback)

	getPageCallback: (ph, callback) ->
		return (err, page) =>
			@page = page;
			callback()
			

	getPageOpenCallback: (callback) ->
		return (err,status) ->
      		throw 'test';
      		#callback()




module.exports = Screenshooter