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

function sassFunc(src, dest, filename) {
    var boolConcat = typeof filename !== "undefined";

    if (boolConcat) {
        return gulp.src(src)
                .pipe(plumber(onError))
                .pipe(sass({
                    //outputStyle: "compressed",
                    includePaths: "bower_components/foundation-sites/scss"
                }))
                .pipe(autoprefixer())
                .pipe(concat(filename + ".css"))
                .pipe(gulp.dest(dest))
                .pipe(browserSync.stream());
    }
    else {
        return gulp.src(src)
                .pipe(plumber(onError))
                .pipe(sass({
                    //outputStyle: "compressed",
                    includePaths: "bower_components/foundation-sites/scss"
                }))
                .pipe(autoprefixer())
                .pipe(gulp.dest(dest))
                .pipe(browserSync.stream());
    }
}

function imageminFunc(src, dest) {
    return gulp.src(src)
            .pipe(imagemin())
            .pipe(gulp.dest(dest));
}

var paths = {
    site: "web/site",
    game: "web/game",
    dist: "web/dist"
};

gulp.task("uglify-site", function () {
    return uglifyFunc(paths.site + "/app/**/*.js", paths.dist + "/site");
});
gulp.task("uglify-game", function () {
    return uglifyFunc(paths.game + "/scripts/**/*.js", paths.dist + "/game");
});

gulp.task("sass-site", function () {
    return sassFunc(paths.site + "/styles/**/*.scss", paths.dist + "/site/styles");
});
gulp.task("sass-game", function () {
    return sassFunc(paths.game + "/styles/**/*.scss", paths.dist + "/game", "style");
});

gulp.task("images-site", function () {
    return imageminFunc(paths.site + "/images/*.*", paths.dist + "/site/images");
});
gulp.task("images-game", function () {
    return imageminFunc(paths.game + "/images/*.*", paths.dist + "/game/images");
});

gulp.task("browser-sync", function () {
    browserSync.init({
        proxy: "http://localhost/MagiciansBattle/web/site/index.html",
        notify: false
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task("watch", function () {
    gulp.watch("*.html", ["bs-reload"]);
    gulp.watch(paths.site + "/**/*.html", ["bs-reload"]);

    gulp.watch(paths.site + "/**/*.js", ["uglify-site", "bs-reload"]);
    gulp.watch(paths.game + "/scripts/**/*.js", ["uglify-game", "bs-reload"]);

    gulp.watch(paths.site + "/styles/**/*.scss", ["sass-site"]);
    gulp.watch(paths.game + "/styles/**/*.scss", ["sass-game"]);

    gulp.watch(paths.site + "/images/*.*", ["images-site"]);
    gulp.watch(paths.game + "/images/*.*", ["images-game"]);
});

gulp.task("default", ["browser-sync", "uglify-site", "uglify-game", "sass-site", "sass-game", "images-site", "images-game", "watch"]);