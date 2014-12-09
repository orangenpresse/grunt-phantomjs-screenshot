# grunt-phantomjs-screenshot

> Takes screenshots of html files with phantomjs. With support of expanded files.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-phantomjs-screenshot --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-phantomjs-screenshot');
```

## The "phantomjs_screenshot" task

### Overview
In your project's Gruntfile, add a section named `phantomjs_screenshot` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  phantomjs_screenshot: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.viewport
Type: `String`
Default value: `1024x768`

The resolution of the screen and the resulting resolution of the screenshots.
WIDTHxHEIGHT

#### options.delay
Type: `Integer`
Default value: `300`

The time in ms until the screenshot is taken

#### options.quality
Type: `Integer`
Default value: `100`

A integer from 0 to 100. It sets the quality of the resulting screenshot, important for jpg

#### options.closeDelay
Type: `Integer`
Default value: `1000`

Delay in ms until phantomjs gets closed. See Known Issues for more detail.

#### options.maxConcurrent
Type: `Integer`
Default value: `3`

The maximum of how many concurrent pages will be used for rendering.

#### options.server
Type: `String`
Default value: `''`

Set hostname if using server.

### Usage Examples

#### Default Options
In this example, the default options are used to take a screenshot from all html files in the src folder. The screenshots
are saved as png in the imagefolder

```js
grunt.initConfig({
	phantomjs_screenshot: {
		main: {
			options: {},
			files: [{
				expand: true,
				cwd: 'src/',
				src: ['**/*.html'],
				dest: 'imagefolder/',
				ext: '.png'
			}]
		}
	},
});
```

#### Custom Options
In this example, custom options are used to do take a screenshot with 1920x1080px and poor quality.
Also the closeDelay is reduced, because the jpeg should be saved fast with that poor quality.

```js
grunt.initConfig({
	phantomjs_screenshot: {
		main: {
			options: {
				viewport: '1920x1080',
				quality: 20,
				delay: 1000,
				closeDelay: 500
			},
			files: {
				'dest/screenshot.jpg': ['src/index.html'],
			}
		}
	}
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Known Issues
If "Request() error evaluating render() call: Error: socket hang up" appears phantomjs was not fast enough to write the screenshots
before exit. Render is not really blocking, see https://github.com/ariya/phantomjs/issues/11084
If the error appears, increase the closeDelay option.
