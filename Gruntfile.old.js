var _ = require('underscore');
var UglifyJS = require("uglify-js");

var environments = {
  dev: {
    serveur : '//172.20.20.64:8018/',
    client  : '//localhost:4000/'
  },
  stable: {
      serveur : '//deviapps.groups.be/ariane/',
      client  : '//localhost:4000/'
  },
  qa: {
      serveur : '//qaiapps.groups.be/ariane/',
      client  : '//qaiapps.groups.be/'
  },
  prod: {
      serveur : '//prestaweb.groups.be/ariane/',
      client  : '//prestaweb.groups.be/'
  }
};

var endpoint;

module.exports = function(grunt) {

  var env = grunt.option("env");
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      dist: ["dist"]
    },
    copy: {
      dist: {
        files: [
          {
            // copier ce qui est dans /public dans /dist
            expand: true,
            src: ['**', '!**/*.orig'],
            dest: 'dist/',
            cwd: 'public/'
          }
        ]
      }
    },
      // LESS
      less: {
          production: {
              options: {
              },
              files: {
                  "public/css/prestaweb-comp.css": "public/less/prestaweb-comp/prestaweb-comp.less",
                  "public/css/itransfer.css": "public/less/itransfer.less"
              }
          }
      },
      cssmin: {
          minify: {
              expand: true,
              cwd: 'dist/css',
              src: ['*.css', '!*.min.css'],
              dest: 'dist/css/',
              ext: '.min.css'
          }
      },
    uglify: {
      options: {
       // banner: "/*! Group S <%= pkg.name %> - v<%= pkg.version %> -  <%= grunt.template.today(\"yyyy-mm-dd\") %> */\n"
      },
      my_target: {
        files: [{
          expand: true,
          src: ['**/*.js'],
          dest: 'dist/js/',
          cwd: 'dist/js/'
        }]
      }
    },
    replace: {
      endpoint: {
        src: ['dist/js/*.js'],             // source files array (supports minimatch)
        dest: 'dist/js/',             // destination directory or file
        replacements: [{
          from: /serverURL = '\/\/.*'/,      // regex replacement
          to: 'serverURL = "' + (environments[env] && environments[env].server) + "'"
        },{
            from: /baseURL = '\/\/.*'/,      // regex replacement
            to: 'baseURL = "'+ (environments[env] && environments[env].client) + "'"
        }]
      }
    },
    htmlmin: {                                     // Task
      dist: {                                      // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          src: ['**/*.html'],
          dest: 'dist/',
          cwd: 'dist/'
        }]
      }
    },
    // make a zipfile
    compress: {
      main: {
        options: {
          archive: 'itransfer-' + grunt.option("tag") + '.zip'
        },
        files: [
          {
            expand: true,
            cwd: 'dist/',
            src: ['**'],
            dest: '.'
          }
        ]
      }
    },
    imagemin: {                          // Task
      dist: {                            // Target
        options: {                       // Target options
          optimizationLevel: 7
        },
        files: [
          {
            expand: true,
            src: ['**/*.jpg'],
            dest: 'dist/',
            cwd: 'dist/'
          },{
            expand: true,
            src: ['**/*.png'],
            dest: 'dist/',
            cwd: 'dist/'
          }
        ]
      }
    },
    processhtml: {
      dist: {
        files: {
          'dist/index.html': ['dist/index.html'],
          'dist/file.html': ['dist/file.html']
        }
      }
    }
  });

  // Load plugins
  require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

  // Tasks.

  grunt.registerTask('check', 'Verifie si les options sont presentes', function() {
    if (!(grunt.option("tag") && grunt.option("env"))) {
      grunt.fail.warn("Spécifiez un numéro de version avec --tag et un environnement avec --env [dev|stable|qa|prod]");
    }
  });




  // Default task(s).
  grunt.registerTask('default',
      [ 'clean',    // vide le dossier dist
        'check',    // vérifie que l'option --tag a été indiquée
        'copy',     // copie ce qui est dans /public dans /dist
          'less',
          'cssmin',
        'uglify',
        //'processhtml',
        'htmlmin',  // minifie les fichiers html
        'compress'  // crée le fichier zip
      ]);
//  grunt.registerTask('full', ['clean', 'check', 'copy', 'processhtml', 'traduction', 'version', 'jsmin', 'htmlmin', 'imagemin', 'compress']);
//  grunt.registerTask('light', ['clean', 'check', 'copy', 'processhtml', 'traduction', 'version', 'compress']);
  grunt.registerTask('test', ['clean', 'check', 'copy', 'processhtml', 'traduction']);
};