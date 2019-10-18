const { src, dest, watch, series, parallel } = require("gulp");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const babel = require("gulp-babel");
const bs = require("browser-sync").create();
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const gutil = require("gulp-util");
const ftp = require("vinyl-ftp");

const ftpConfig = {
  host: "ftp.testingwebsite.tech",
  user: "u878511404.renz",
  pass: "K1&`rJxd",
  remoteFolder: "/wp-content/themes/myTheme",
  localFilesGlob: ["./**/*"]
};

const files = {
  scssPath: "./gulp-scss/**/*.scss",
  jsPath: "./gulp-js/*.js"
};

function getFtpConn() {
  return ftp.create({
    host: ftpConfig.host,
    user: ftpConfig.user,
    password: ftpConfig.pass,
    parallel: 10,
    log: gutil.log
  });
}

function onInitDeploy() {
  var conn = getFtpConn();

  var globs = [
    "assets/**",
    "gulp-js/**",
    "gulp-scss/**",
    "inc/**",
    "js/**",
    "languages/**",
    "layouts/**",
    "template-parts/**",
    "*",
    "!node_modules/**",
    "!node_modules"
  ];

  return src(globs, { base: ".", buffer: false })
    .pipe(conn.newer(ftpConfig.remoteFolder))
    .pipe(conn.dest(ftpConfig.remoteFolder));
}

function scssTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .on("error", sass.logError)
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write())
    .pipe(dest("./"))
    .pipe(bs.reload({ stream: true }));
}

function reload() {
  bs.reload();
}

function jsTask() {
  return src(files.jsPath)
    .pipe(
      babel({
        presets: ["@babel/preset-env"]
      })
    )
    .pipe(rename("script.js"))
    .pipe(dest("./"))
    .pipe(bs.reload({ stream: true }));
}

function watchFiles() {
  bs.init({
    server: {
      baseDir: "./"
    }
  });
  watch("gulp-scss/**/*.scss").on("change", reload);
  watch("./*").on("change", event => {
    var conn = getFtpConn();

    return src([event], { base: ".", buffer: false })
      .pipe(conn.newer(ftpConfig.remoteFolder))
      .pipe(conn.dest(ftpConfig.remoteFolder));
  });
  watch("./gulp-js/*.js").on("change", reload);
}

exports.default = parallel(watchFiles, onInitDeploy);
