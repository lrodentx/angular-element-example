const gulp = require("gulp");
const concat = require("gulp-concat");
const gzip = require("gulp-gzip");
const append = require("gulp-append");

gulp.task("package", () => {
  gulp
    .src(["dist/elements-demo/*.js", "widget.js"])
    .pipe(concat("elements.js"))
    .pipe(gzip())
    .pipe(gulp.dest("./"));
});
