/**
 * Created by bisconti on 09/10/14.
 */
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

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Project settings
        config: config,

        // Watches files for changes and runs tasks based on the changed files
        watch: {

            js: {
                files: ['<%= config.app %>/js/{,*/}*.js'],
                // tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            jstest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['test:watch']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            styles: {
                files: ['<%= config.app %>/css/{,*/}*.css'],
                tasks: ['newer:copy:styles']
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
        useminPrepare: {
            html: ['<%= config.app %>/index.html','<%= config.app %>/file.html']
        },
        usemin:{
            html: ['dist/index.html', 'dist/file.html']
        },
        /*copy:{
            html: {
                src: ['public/index.html','public/file.html'],
                dest: 'dist/'
            }
        }*/
        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: ['data/i18n.json']
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= config.app %>/css',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    //grunt.loadNpmTasks('grunt-usemin');
    require('matchdep').filterAll('grunt-*').forEach(grunt.loadNpmTasks);

    // Default task(s).
    //grunt.registerTask('default', ['uglify']);
    grunt.registerTask('default', ['build']);

    // simple build task
    grunt.registerTask('build', [
        'copy',
        'useminPrepare',
        'concat',
        'cssmin',
        'uglify',
        'usemin'
    ]);

    grunt.registerTask('serve', function (target) {
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


};