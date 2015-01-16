// set up the settings
var prestaWebGrunt = '../presta-web-grunt',
	prestaWebGruntConfig = 'module',
	enableCustomizations = function enableCustomizations(grunt) {

	// custom config
	grunt.config.merge({
		// values here override the template
	});

},

	fs = require('fs'),
	rl = function(path) { return fs.existsSync(path) ? fs.readFileSync(path, 'utf8') + '//@ sourceURL=' + path : ''; },
	rf = function(path) { return rl(prestaWebGrunt + path); };

// branch to the master grunt
eval(rl('Gruntfile.local.js'));
eval(rf('/grunt.local.js'));
eval(rf('/grunt.js'));
