// Generated on 2014-08-05 using generator-webapp 0.4.9
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths
  var config = {
    app: 'public',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

      // Project settings
      config: config,

      pkg:           grunt.file.readJSON('package.json'),

      // Watches files for changes and runs tasks based on the changed files
      watch:         {
        /*bower: {
         files: ['bower.json'],
         tasks: ['bowerInstall']
         },*/
        js:         {
          files: ['<%= config.app %>/js/{,*/}*.js'],
          // tasks: ['jshint'],
          options: {
            livereload: true
          }
        },
        jstest:     {
          files: ['test/spec/{,*/}*.js'],
          tasks: ['test:watch']
        },
        gruntfile:  {
          files: ['Gruntfile.js']
        },
        styles:     {
          files: ['<%= config.app %>/css/{,*/}*.css'],
          tasks: ['newer:copy:styles']//, 'autoprefixer']
        },
        livereload: {
          options: {
            livereload: '<%= connect.options.livereload %>'
          },
          files: [
            '<%= config.app %>/{,*/}*.*'
          ]
        }
      },

      // The actual grunt server settings
      connect:       {
        options:    {
          port:     4001,
          open:     true,
          livereload: {port: 35728},
          // Change this to '0.0.0.0' to access the server from outside
          //hostname  : '172.20.20.64'
          hostname: 'localhost'
        },
        livereload: {
          options: {
            middleware: function(connect) {
              return [
                connect.static('.tmp'),
                connect().use('/bower_components', connect.static('./bower_components')),
                connect.static(config.app)
              ];
            }
          }
        },
        test:       {
          options: {
            open:       false,
            port:       9001,
            middleware: function(connect) {
              return [
                connect.static('.tmp'),
                connect.static('test'),
                connect().use('/bower_components', connect.static('./bower_components')),
                connect.static(config.app)
              ];
            }
          }
        },
        dist:       {
          options: {
            base: '<%= config.dist %>',
            livereload: false
          }
        }
      },

      // Empties folders to start fresh
      clean:         {
        dist: {
          files: [{
            dot: true,
            src: [
              '.tmp',
              '<%= config.dist %>/*',
              '!<%= config.dist %>/.git*'
            ]
          }]
        },
        server: '.tmp'
      },

      // Reads HTML for usemin blocks to enable smart builds that automatically
      // concat, minify and revision files. Creates configurations in memory so
      // additional tasks can operate on them
      useminPrepare: {
        options: {
          dest: '<%= config.dist %>'
        },
        html: [
          '<%= config.app %>/index.html',
          '<%= config.app %>/file.html'
        ]

      },

      // Performs rewrites based on rev and the useminPrepare configuration
      usemin:        {
        options: {
          assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/images']
        },
        html: ['<%= config.dist %>/{,*/}*.html'],
        css:  ['<%= config.dist %>/styles/{,*/}*.css']
      },

      // The following *-min tasks produce minified files in the dist folder
      /* replace      : {
       example: {
       src         : ['public/js/login.js'],             // source files array (supports minimatch)
       dest        : '<%= config.dist %>/js/',             // destination directory or file
       replacements: [{
       from: "$('input#login').val('F00000001');",
       to  : '//'
       }, {
       from: "$('input#password').val('P@$$w0rd');",
       to  : '//'
       }]
       }
       },*/

      htmlmin: {
        dist: {
          options: {
            collapseBooleanAttributes: true,
            collapseWhitespace:      true,
            removeAttributeQuotes:   true,
            removeCommentsFromCDATA: true,
            removeEmptyAttributes:   true,
            removeOptionalTags:      true,
            removeRedundantAttributes: true,
            useShortDoctype:         true
          },
          files:   [{
            expand: true,
            cwd:  '<%= config.dist %>',
            src:  ['<%= config.dist %>/{,*/}*.html'],
            dest: '<%= config.dist %>'
          }]
        }
      },

      // By default, your `index.html`'s <!-- Usemin block --> will take care of
      // minification. These next options are pre-configured if you do not wish
      // to use the Usemin blocks.
      concat:  {
        dist: {}
      },
      cssmin:  {
        dist: {
          files: {
            '<%= config.dist %>/css/itransfer.css': [
              '<%= config.app %>/{,*/}*.css'
            ]
          }
        }
      },
      uglify:  {
        dist: {
          files: {
            '<%= config.dist %>/js/scripts.js': [
              '<%= config.dist %>/js/*.js'
            ]
          }
        }
      },

      'string-replace': {
        version: {
          files:   {
            'public/index.html': 'public/login.html'
          },
          options: {
            replacements: [{
              pattern: /@@versionNumber@@/g,
              replacement: '<%= pkg.version %>'
            }, {
              pattern: /\/\*BEGIN*\*\/END/g,
              replacement: ''
            }]
          }
        }
      },

      // Copies remaining files to places other tasks can use
      copy:             {
        dist:   {
          files: [{
            expand: true,
            dot:  true,
            cwd:  '<%= config.app %>',
            dest: '<%= config.dist %>',
            src:  ['data/i18n.json']
          }]
        },
        styles: {
          expand: true,
          dot:  true,
          cwd:  '<%= config.app %>/css',
          dest: '.tmp/styles/',
          src:  '{,*/}*.css'
        }
      },

      // Run some tasks in parallel to speed up build process
      concurrent:       {
        server: [
          'less',
          'copy:styles'
        ],
        test: [
          'copy:styles'
        ],
        dist: [
          'less',
          'copy:styles'
        ]
      },
      // LESS
      less:             {
        production: {
          options: {},
          files: {
            'public/css/port-components.css': 'public/less/port-components.less',
            'public/css/gst.css':             'public/less/gst.less'
          }
        }
      }
    }
  );

  grunt.registerTask('serve', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'concurrent:server',
      //'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function(target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });

  grunt.registerTask('version', function(target) {
    grunt.task.run(['string-replace']);
  });

  grunt.registerTask('test', function(target) {
    if (target !== 'watch') {
      grunt.task.run([
        'clean:server',
        'concurrent:test'//,
        //'autoprefixer'
      ]);
    }

    grunt.task.run([
      'connect:test'//,
      //'mocha'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'useminPrepare',
    'concurrent:dist',
    //'autoprefixer',
    'replace',
    'less',
    //'concat',
    'cssmin',
    'uglify',
    'htmlmin',
    'copy:dist',
    //'modernizr',
    //'rev',
    'usemin'

  ]);

  grunt.registerTask('default', [
    'clean:dist',
    'replace',
    'build'
  ]);

  // cg

  // Load plugins
  require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);
  /*grunt.loadNpmTasks('grunt-include-bootstrap');
   grunt.loadNpmTasks('grunt-contrib-less');
   grunt.loadNpmTasks('grunt-contrib-watch');*/
  // /cg
};
