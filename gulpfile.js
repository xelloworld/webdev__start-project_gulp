import gulp from 'gulp';
import del from 'del';
import htmlMin from 'gulp-htmlmin';
import fileInclude from 'gulp-file-include';
import rename from 'gulp-rename';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import groupCssMedia from 'gulp-group-css-media-queries'
import nodeSass from 'sass';
import browserSync from 'browser-sync';

const {src, dest, parallel, series, watch} = gulp;
const sass = gulpSass(nodeSass);

// Clean build

export const cleanBuild = () => {
  return del('build');
}

// HTML build

export const htmlBuild = () => {
  return src('src/html/pages/*.html')
    .pipe(fileInclude({
        prefix: '@',
    }))
    .pipe(htmlMin({
      removeComments: true,
      // collapseWhitespace: true,
      // preserveLineBreaks: true
    }))
    .pipe(dest('build'))
    .pipe(browserSync.stream())
}

// Style build

export const styleBuild = () => {
  return src('src/scss/*.scss')
  .pipe(sass())
  .pipe(autoprefixer({
    overrideBrowserslist: ["last 5 versions"],
    grid: true
  }))
  .pipe(groupCssMedia())
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(dest('build/css'))
  .pipe(browserSync.stream())
}

// Browsersync

export const liveServer = () => {
  browserSync.init({
    server: {
      baseDir: 'build'
    },
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false
    },
    notify: false,
    open: false,
    online: true
  });
  watch('src/html/**/*.html', htmlBuild);
  watch('src/scss/**/*.scss', styleBuild);
}

// Default

export default series(
  cleanBuild,
  parallel(
    htmlBuild,
    styleBuild
  ),
  liveServer
);
