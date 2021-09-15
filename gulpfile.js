const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const htmlmin = require("gulp-htmlmin");
const uglify = require("gulp-uglify");
const del = require("del");


// Clean

const clean = () => {
  return del("public");
}

exports.clean = clean;


// Copy

const copy = (done) => {

  return gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/*.ico",
    "source/img/**/*.{png,svg,jpg}",
    "!source/img/sprite_icons/*"
  ],
    {
      base: "source"
    })
    .pipe(gulp.dest("public"))
  done();
}

exports.copy = copy;


//Scripts

const scripts = () => {
  return gulp.src("source/js/*.js")
    .pipe(uglify())
    .pipe(rename("script.min.js"))
    .pipe(gulp.dest("public/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;


// HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("public"))
}

exports.html = html;


// Sprite

const sprite = () => {
  return gulp.src("source/img/sprite_icons/*.svg")
    .pipe(imagemin([imagemin.svgo()]))
    .pipe(svgstore())
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("public/img"))
}

exports.sprite = sprite;


// Webp

const createWebp = () => {
  return gulp.src("source/img/content/**/*.{png,jpg}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest("public/img/content"))
}

exports.createWebp = createWebp;


// Image

const images = () => {
  return gulp.src([
    "source/img/**/*.{png,svg,jpg}",
    "!source/img/sprite_icons/*"
  ])
    .pipe(imagemin([
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.mozjpeg({ progressive: true }),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("public/img"))
}

exports.images = images;


// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("public/css"))
    .pipe(sync.stream());
}

exports.styles = styles;


// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: 'public'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;


// Reload

const reload = done => {
  sync.reload();
  done();
}


// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/js/script.js", gulp.series(scripts));
  gulp.watch("source/*.html", gulp.series(html, reload));
  gulp.watch("source/img/sprite_icons", gulp.series(sprite, reload));
}


//Build

const build = gulp.series(
  clean,
  gulp.parallel(
    html,
    styles,
    scripts,
    sprite,
    copy,
    images,
    createWebp
  )
);

exports.build = build;


// Defauly

exports.default = gulp.series(
  build,
  gulp.series(
    server,
    watcher
  )
);
