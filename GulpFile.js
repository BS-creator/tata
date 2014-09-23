/**
 * Created by bisconti on 23/09/14.
 */
var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var clean = require('gulp-clean');

gulp.task('usemin',['clean'], function() {
    gulp.src('public/*.html')
        .pipe(usemin({
            css: [minifyCss(), 'concat'],
            html: [minifyHtml({empty: true})],
            js: [uglify(), rev()]
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('clean', function(){
    return gulp.src('build', {read: false})
        .pipe(clean());
});

gulp.task('default', ['usemin'] );