var gulp = require('gulp'),
        sass = require('gulp-sass'),
        rename = require("gulp-rename"),
        concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        plumber = require('gulp-plumber'),
        browserSync = require('browser-sync').create(),
        autoprefixer = require('gulp-autoprefixer'),
        sourcemaps = require('gulp-sourcemaps'),
        imagemin = require('gulp-imagemin'),
        ngAnnotate = require('gulp-ng-annotate');

function onError(err) {
    console.log(err);
    this.emit("end");
}

function uglifyFunc(src, dest) {
    return gulp.src(src)
            .pipe(plumber(onError))
            .pipe(sourcemaps.init())
            .pipe(concat("script.js"))
            //.pipe(ngAnnotate())
            //.pipe(uglify())
            .pipe(sourcemaps.write("maps"))
            .pipe(gulp.dest(dest));
}

function sassFunc(src, dest) {
    return gulp.src(src)
            .pipe(plumber(onError))
            .pipe(sass({outputStyle: "compressed"}))
            .pipe(autoprefixer())
            .pipe(concat("style.css"))
            .pipe(gulp.dest(dest))
            .pipe(browserSync.stream());
}

function imageminFunc(src, dest) {
    return gulp.src(src)
            .pipe(imagemin())
            .pipe(gulp.dest(dest));
}

var sitePath = "web/site";
var gamePath = "web/game";
var distPath = "web/dist";

gulp.task("uglify-site", function () {
    return uglifyFunc(sitePath + "/app/**/*.js", distPath + "/site");
});
gulp.task("uglify-game", function () {
    return uglifyFunc(gamePath + "/scripts/**/*.js", distPath + "/game");
});

gulp.task("sass-site", function () {
    return sassFunc(sitePath + "/styles/*.scss", distPath + "/site");
});
gulp.task("sass-game", function () {
    return sassFunc(gamePath + "/styles/*.scss", distPath + "/game");
});

gulp.task("images-site", function () {
    return imageminFunc(sitePath + "/images/*.*", distPath + "/site/images");
});
gulp.task("images-game", function () {
    return imageminFunc(gamePath + "/images/*.*", distPath + "/game/images");
});

gulp.task("browser-sync", function () {
    browserSync.init({
        proxy: "http://localhost/MagiciansBattle/web/site/index.html"
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task("watch", function () {
    gulp.watch("*.html", ["bs-reload"]);
    gulp.watch(sitePath + "/**/*.html", ["bs-reload"]);

    gulp.watch(sitePath + "/**/*.js", ["uglify-site", "bs-reload"]);
    gulp.watch(gamePath + "/scripts/**/*.js", ["uglify-game", "bs-reload"]);

    gulp.watch(sitePath + "/styles/*.scss", ["sass-site"]);
    gulp.watch(gamePath + "/styles/*.scss", ["sass-game"]);

    gulp.watch(sitePath + "/images/*.*", ["images-site"]);
    gulp.watch(gamePath + "/images/*.*", ["images-game"]);
});

gulp.task("default", ["browser-sync", "uglify-site", "uglify-game", "sass-site", "sass-game", "images-site", "images-game", "watch"]);