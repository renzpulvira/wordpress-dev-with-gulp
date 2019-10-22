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
const imagemin = require("gulp-imagemin");
const uglify = require("gulp-uglify");
const cache = require("gulp-cache");

// FTP Configuration
const ftpConfig = {
  host: "myHost",
  user: "myUser",
  pass: "myPass",
  remoteFolder: "/wp-content/themes/bunney-website",
  siteUrl: "your-url.dev"
};

var globs = [
  "./assets/**",
  "./gulp-js/**",
  "./gulp-scss/**",
  "./*",
  "!/gulpfile.js",
  "!node_modules/**"
];

const files = {
  scssPath: "./gulp-scss/**/*.scss",
  jsPath: "./gulp-js/*.js",
  assetsPath: "./assets/*"
};

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

function jsTask() {
  return src(files.jsPath)
    .pipe(
      babel({
        presets: ["@babel/preset-env"]
      })
    )
    .pipe(uglify())
    .pipe(rename("script.js"))
    .pipe(dest("./"))
    .pipe(bs.reload({ stream: true }));
}

function getConn() {
  return ftp.create({
    host: ftpConfig.host,
    user: ftpConfig.user,
    password: ftpConfig.pass,
    parallel: 10,
    log: gutil.log
  });
}

function deploy() {
  var conn = getConn();

  return src(globs, { base: ".", buffer: false })
    .pipe(conn.newer(ftpConfig.remoteFolder))
    .pipe(conn.dest(ftpConfig.remoteFolder));
}

function optimize() {
  return src(files.assetsPath)
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.jpegtran({ progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }]
        })
      ])
    )
    .pipe(dest("optimized/"));
}

function watchFiles() {
  var conn = getConn();

  bs.init({
    proxy: {
      target: ftpConfig.siteUrl
    }
  });

  // Watch Root files
  watch(["./**"]).on("change", event => {
    bs.reload();
    return src([event], { base: ".", buffer: false })
      .pipe(conn.newer(ftpConfig.remoteFolder))
      .pipe(conn.dest(ftpConfig.remoteFolder))

      .on("error", function(err) {
        console.log(err.toString());

        this.emit("end");
      });
  });

  // Watch Js files
  watch([files.jsPath], jsTask).on("change", event => {
    bs.reload();
    return src([event], { base: ".", buffer: false })
      .pipe(conn.newer(ftpConfig.remoteFolder))
      .pipe(conn.dest(ftpConfig.remoteFolder))

      .on("error", function(err) {
        console.log(err.toString());

        this.emit("end");
      });
  });

  // Watch Scss files
  watch([files.scssPath], scssTask).on("change", event => {
    bs.reload();
    return src([event], { base: ".", buffer: false })
      .pipe(conn.newer(ftpConfig.remoteFolder))
      .pipe(conn.dest(ftpConfig.remoteFolder))

      .on("error", function(err) {
        console.log(err.toString());

        this.emit("end");
      });
  });
}

exports.default = series(deploy, watchFiles);
exports.optimize = optimize;
