var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var rename = require('gulp-rename');
var size = require('gulp-size');

var browserSync = require('browser-sync');
var reload = browserSync.reload;
var runSequence = require('run-sequence');

var del = require('del');
var merge = require('merge-stream');
/**
* Default Task
*/
gulp.task('default', ['clean'], function() {
	 runSequence(['copy-temp'], 'vulcanize', 'build', 'clean-temp');
});

/**
* Copy and Sort files Task
*/
gulp.task('copy-temp', function () {
  var app = gulp.src([
    'app/*',
  ], {
    dot: true
  }).pipe(gulp.dest('.temp'));

  var bower = gulp.src([
    'bower_components/**/**'
  ]).pipe(gulp.dest('.temp/resources/bower_components'));

  var theme = gulp.src([
	'app/resources/theme/*'
  ]).pipe(gulp.dest('.temp/resources/theme'));
  
  var elements = gulp.src(['app/resources/elements/**/*'])
    .pipe(gulp.dest('.temp/resources/elements'));

  var vulcanized = gulp.src(['app/resources/elements/elements.html'])
    .pipe(rename('elements.vulcanized.html'))
    .pipe(gulp.dest('.temp/resources/elements'));

  return merge(app, bower, elements, vulcanized, theme)
    .pipe(size({title: 'copy'}));
});

/**
* Copy and Sort files Task
*/
gulp.task('build', function () {
  var app = gulp.src([
    '.temp/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));

  var bower = gulp.src([
    'bower_components/webcomponentsjs/webcomponents-lite.min.js'
  ]).pipe(gulp.dest('dist/resources/bower_components/webcomponentsjs'));
  
  var elements = gulp.src(['.temp/resources/elements/elements.vulcanized.html'])
    .pipe(gulp.dest('dist/resources/elements'));

  return merge(app, bower, elements)
    .pipe(size({title: 'copy'}));
});


/**
* Clean last build
*/
gulp.task('vulcanize', function () {
  var DEST_DIR = '.temp/resources/elements';

  return gulp.src('.temp/resources/elements/elements.vulcanized.html')
    .pipe(vulcanize({
      stripComments: true,
      inlineCss: true,
      inlineScripts: true
    }))
    .pipe(gulp.dest(DEST_DIR))
    .pipe(size({title: 'vulcanize'}));
});

/**
* Clean last build
*/
gulp.task('clean', del.bind(null, ['.temp', 'dist']));

/**
* Clean last build
*/
gulp.task('clean-temp', del.bind(null, ['.temp']));

/**
* Sync into Browser
*/
gulp.task('watch', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  });
  gulp.watch(['*.html', 'styles/**/*.css', 'scripts/**/*.js'], {cwd: 'app'}, reload);
});