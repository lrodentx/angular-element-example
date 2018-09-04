const gulp = require("gulp");
const concat = require("gulp-concat");
const gzip = require("gulp-gzip");

gulp.task("package", () => {
  gulp
    .src("dist/elements-demo/*.js")
    .pipe(concat('elements.js'))
    .pipe(gzip())
    .pipe(gulp.dest("./"));
}); 
