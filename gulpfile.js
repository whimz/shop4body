const { src, dest, watch, parallel } = require('gulp');

const scss         = require('gulp-dart-sass');
const concat       = require('gulp-concat');
const sourcemaps   = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const babel        = require('gulp-babel');
const uglify       = require('gulp-uglify-es').default;
const browsersync  = require('browser-sync').create();

function styles(){
  return src('app/scss/style.scss')
    .pipe(sourcemaps.init())
    .pipe(scss({outputStyle: 'expanded'}))
    .pipe(autoprefixer(['last 15 versions', '< 1%', 'ie 10']))
    .pipe(concat('style.min.css'))
    .pipe(sourcemaps.write(''))
    .pipe(dest('app/css'))
    .pipe(browsersync.stream()); 
}

function scripts(){
  return src([
    'app/js/main.js'
  ])
  .pipe(babel({presets: ['@babel/env']}))
  .pipe(concat('main.min.js'))
  .pipe(sourcemaps.init())
  .pipe(uglify())
  .pipe(sourcemaps.write(''))
  .pipe(dest('app/js'))
  .pipe(browsersync.stream()); 
}

function watching(){
  watch(['app/scss/**/*.scss'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/*.html']).on('change', browsersync.reload);
}

function browserSync(){
  browsersync.init({
    server: {
      baseDir: 'app/'
    },
    notify: false
  });
}

function build(){
  return src([
    'app/css/style.min.css',
    'app/fonts/**/*',
    'app/lib/jquery/*',
    'app/js/main.min.js',
    'app/*.html'
  ], {base: 'app'})
    .pipe(dest('dist'));
}

exports.styles = styles;
exports.watching = watching;
exports.browserSync = browserSync;
exports.scripts = scripts;
exports.build = build;

exports.default = parallel(scripts, browserSync, watching);