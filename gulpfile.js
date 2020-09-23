// Variabler
const { src, dest, watch, series, parallel } = require("gulp");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');


// Sökvägar
const files = {
    htmlPath: "src/**/*.html",
    //cssPath: "src/**/*.css",
    jsPath: "src/**/*.js",
    imagePath: "src/images/*",
    htmlmin: "src/*.html",
    sassPath: "src/sass/*.scss"
}

// Gör om sassfil till css
// lägg till i main css
function sassTask() {
    return src(files.sassPath)
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('pub/css'))

}

/*
// Lägg ihop och minifiera
function cssTask() {
    return src(files.cssPath)
        .pipe(concat('main.css'))
        .pipe(cleanCSS())
        .pipe(dest('pub/css'))
}
*/

// Minifiera html-filer och kopiera
function htmlTask() {
    return src(files.htmlPath)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('pub'))
}

// Minifiera med imagemin och kopiera
function imageTask() {
    return src(files.imagePath)
        .pipe(imagemin())
        .pipe(dest('pub/images'))
}

// Sammanslå js-filer och minifiera med uglify
function jsTask() {
    return src(files.jsPath)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('pub/js'))
}

// Watcher och browsersync
function watchTask() {
    browserSync.init({
        server: {
            baseDir: './pub/'
        }
    });

    watch(files.htmlPath, htmlTask).on('change', browserSync.reload);
    watch(files.imagePath, imageTask).on('change', browserSync.reload);
    watch(files.jsPath, jsTask).on('change', browserSync.reload);
    watch(files.sassPath, sassTask).on('change', browserSync.reload);
    //watch(files.cssPath, cssTask).on('change', browserSync.reload);
};

// Kör globalt
exports.default = series(
    parallel(htmlTask, imageTask, sassTask, jsTask),
    watchTask
)