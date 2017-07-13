'use strict';
var gulp = require('gulp');
var GulpSSH = require('gulp-ssh');

var useref = require('gulp-useref');
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');
var cache = require('gulp-cache');
var zip = require('gulp-zip');

var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');

var runner = require('run-sequence');
var del = require('del');

var config = {
  src: 'src/',
  imgDir: 'images/',
  jsDir: 'js/',
  cssDir: 'css/',
  distDir: 'dist/wantong-zunxin/',
  htmlDir: './',
  iconDir: 'font/'
};

var sshConfig = {
  host: '192.168.0.195',
  port: 22,
  username: 'root',
  password: 'Qf_Dict@2015'
};

var ssh = new GulpSSH({
  ignoreErrors: false,
  sshConfig: sshConfig
});

gulp.task('js', function() {
  return gulp.src([
      config.src + config.jsDir + '**/*.js',
      'tmp/js/**/*.js',
      '!' + config.src + config.jsDir + 'common.js',
      '!' + config.src + config.jsDir + 'sm.js',
      '!' + config.src + config.jsDir + 'sm-extend.js',
      '!' + config.src + config.jsDir + 'zepto.js'
    ])
    .pipe(uglify({
      compress: {
        drop_console: true
      }
    }))
    .pipe(rev())
    .pipe(gulp.dest(config.distDir + config.jsDir))
    .pipe(rev.manifest())
    .pipe(gulp.dest('tmp/rev/js'));
});

gulp.task('css', function() {
  return gulp.src([config.src + config.cssDir + '*.css'])
    .pipe(cssnano())
    .pipe(rev())
    .pipe(gulp.dest(config.distDir + config.cssDir))
    .pipe(rev.manifest())
    .pipe(gulp.dest('tmp/rev/css'));
});

gulp.task('fonts', function() {
  return gulp.src([
      config.src + config.cssDir + '*.svg',
      config.src + config.cssDir + '*.ttf',
      config.src + config.cssDir + '*.woff'
    ])
    .pipe(gulp.dest(config.distDir + config.cssDir));
});

gulp.task('icon', function() {
  return gulp.src([
      config.src + config.iconDir + '*.*'
    ])
    .pipe(gulp.dest(config.distDir + config.iconDir));
});

gulp.task('images', function() {
  return gulp.src([config.src + config.imgDir + '**/*'])
    .pipe(imagemin({
      interlaced: true
    }))
    .pipe(gulp.dest(config.distDir + config.imgDir));
});

gulp.task('html', function() {
  return gulp.src([
      'tmp/rev/**/*.json',
      'tmp/**/*.html'
    ])
    .pipe(revCollector())
    .pipe(htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe(gulp.dest(config.distDir));
});

gulp.task('prepare', function() {
  return del([
    config.distDir
  ]);
});

gulp.task('useref', function() {
  return gulp.src([
      config.src + config.htmlDir + '**/*.html',
      '!' + config.distDir + '**/*',
      '!node_modules/**/*.html'
    ])
    .pipe(useref())
    .pipe(gulp.dest('tmp'));
});

gulp.task('zip', function() {
  return gulp.src('dist/wantong-zunxin/**', {base: './dist/'})
  .pipe(zip('wantong-zunxin.zip'))
  .pipe(gulp.dest('dist'));
});

gulp.task('txt', function() {
  return gulp.src('src/*.txt')
  .pipe(gulp.dest('dist/wantong-zunxin'));
});

gulp.task('deploy195', function() {
  return gulp.src(
   'dist/wantong-zunxin/**/*.*'
  )
  .pipe(ssh.dest('/data/www/wantong-zunxin'));
});

gulp.task('clean', function() {
  return del([
    'tmp'
  ]);
});

gulp.task('default', function(callback) {
  runner(
    'prepare',
    'useref', ['js', 'css', 'images', 'fonts', 'icon'],
    'html','txt',
    'clean',
    'zip',
    callback);
});

