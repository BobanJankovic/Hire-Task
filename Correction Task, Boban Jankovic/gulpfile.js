const gulp = require("gulp");
const sass = require("gulp-sass");
const browserSync = require("browser-sync").create();
const uglifycss = require("gulp-uglifycss");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify");
sassLint = require('gulp-sass-lint');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const fontName = 'Icons';
const runTimestamp = Math.round(Date.now() / 1000);
const svgmin = require('gulp-svgmin');
const svgSymbols = require('gulp-svg-symbols')
let inputPath = __dirname;
let outputPath = inputPath;
var gutil = require('gulp-util');
gutil.beep();

//Using Babel i'm transpile JavaScript es6 to es5 and minifying , result is in dist foler
gulp.task("babel-minify", () =>
  gulp.src("./script/script.js")
  .pipe(babel({
    presets: ["es2015"]
  }))
  .pipe(uglify({
    mangle: false,
    // output: {
    //   beautify: true,
    //   comments: true
    // }
  }))
  .pipe(gulp.dest("./dist/"))
);

//Task for generation iconFont SVG Graphics
gulp.task('iconfont', function () {
  return gulp.src(['pre-assets/icons/*.svg'])
    .pipe(iconfontCss({
      fontName: 'svgIcons',
      cssClass: 'font',
      path: 'conf/_icons.scss',
      targetPath: inputPath + '/scss/autogenerate/_icons.scss',
      fontPath: '../fonts'
    }))
    .pipe(iconfont({
      prependUnicode: false,
      fontName: 'svgIcons',
      formats: ['ttf', 'woff2', 'woff'],
      normalize: true,
      timestamp: runTimestamp,
      centerHorizontally: true
    }))
    .on('glyphs', function (glyphs, options) {
      console.log(glyphs, options);

    })
    .pipe(gulp.dest(outputPath + '/fonts/'));
});

//Task for optimizing SVG
gulp.task('svgomg', function () {
  return gulp.src(['pre-assets/icons/*.svg'])
    .pipe(svgmin({
      plugins: [{
          removeTitle: true
        },
        {
          removeRasterImages: true
        },
        {
          sortAttrs: true
        }
      ]
    }))
    .pipe(gulp.dest('./pre-assets/icons'));
});

//Minifying CSS
gulp.task("css", done => {
  gulp.src("./css/*.css")
    .pipe(uglifycss({
      "maxLineLen": 80,
      "uglyComments": true
    }))
    .pipe(gulp.dest("./dist/"));
  done();
});

//Transpile SCSS to CSS
function style() {
  return gulp.src("./scss/main.scss")
    .pipe(sass())
    .pipe(gulp.dest("./css"))
    .pipe(browserSync.stream());
}


//Linting SASS through _sass-lint.yml configuration file
function lint() {
  return gulp.src('sass/**/*.s+(a|c)ss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
}

//Watch for changes
function watch() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  gulp.watch("./scss/**/*.scss", style);
  gulp.watch("./css/*.css", gulp.series(['css']));
  gulp.watch("./script/*.js", gulp.series(["babel-minify"])).on("change", browserSync.reload);
  gulp.watch("./*.html").on("change", browserSync.reload);

}

gulp.task("build:icons", gulp.series('iconfont'));
gulp.task('sync:icons', function () {
  return gulp.src('./pre-assets/icons/**.svg')
    .pipe(svgSymbols())
    .pipe(gulp.dest('./fonts/icons/css'))
});

exports.style = style;
exports.watch = watch;
exports.lint = lint;

//Command GULP run all of this
gulp.task("default", gulp.series([lint, style, "css", "babel-minify", watch]));