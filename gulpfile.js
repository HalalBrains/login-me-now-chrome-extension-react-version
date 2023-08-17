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
  return gulp.src(['build/**', '!src/chrome'])
    .pipe(replace('chrome.storage.local', 'browser.storage.local'))
    .pipe(replace('type="datetime-local"', 'type="date"'))
    .pipe(replace(/"manifest_version":\s*3/g, '"manifest_version": 2'))
    .pipe(replace('"host_permissions": ["http://*/*", "https://*/*"],', ''))
    .pipe(replace('"update_url": "https://clients2.google.com/service/update2/crx",', '"homepage_url": "https://loginmenow.com/",'))
    .pipe(replace(/"action": {\s*"default_popup": "index.html",\s*"default_title": "Login Me Now"\s*},/, '"browser_action": {\n    "default_icon": "icon.png",\n    "default_popup": "index.html",\n    "default_title": "Login Me Now"\n  },'))
    .pipe(replace(/"permissions": \[\s*"storage",\s*"scripting"\s*\],/, '"permissions": [\n    "storage",\n    "scripting",\n    "webRequest",\n    "<all_urls>"\n  ],'))
    .pipe(replace(/"content_scripts": [\s*{[^}]*}\s*]/, '[\n    {\n      "matches": ["http://*/wp-admin/*", "https://*/wp-admin/*"],\n      "js": ["scripting.js"]\n    }\n  ]'))
    .pipe(replace(/"content_security_policy": {[^}]*},/, ''))


    .pipe(gulp.dest('firefox'));
});

gulp.task('package-firefox', () => {
  return gulp.src('firefox/**')
    .pipe(zip('firefox-extension.zip'))
    .pipe(gulp.dest('dist'));
});

// Default task to build and package for both browsers
gulp.task('default', gulp.series('build-chrome', 'package-chrome', 'build-firefox', 'package-firefox'));
