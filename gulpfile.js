const gulp = require('gulp');
const zip = require('gulp-zip');
const replace = require('gulp-replace');

// Build and package for Chrome
gulp.task('build-chrome', () => {
  return gulp.src(['build/**', '!build/firefoxManifest.json', '!src/firefox'])
    .pipe(gulp.dest('chrome'));
});

gulp.task('package-chrome', () => {
  return gulp.src('chrome/**')
    .pipe(zip('chrome-extension.zip'))
    .pipe(gulp.dest('dist'));
});

// Build and package for Firefox
gulp.task('build-firefox', () => {
  return gulp.src(['build/**', '!build/manifest.json', '!src/chrome'])
    .pipe(replace('BROWSER_SPECIFIC_KEY', 'FIREFOX_SPECIFIC_KEY'))
    .pipe(gulp.dest('firefox'));
});

gulp.task('package-firefox', () => {
  return gulp.src('firefox/**')
    .pipe(zip('firefox-extension.zip'))
    .pipe(gulp.dest('dist'));
});

// Default task to build and package for both browsers
gulp.task('default', gulp.series('build-chrome', 'package-chrome', 'build-firefox', 'package-firefox'));
