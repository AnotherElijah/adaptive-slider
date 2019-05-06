const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const babel = require('gulp-babel');
const concat = require('gulp-concat');
/****************JS*****************/
gulp.task('concat', function() {
    return gulp.src(['src/carouselModule/custom-carousel.js', 'src/carouselModule/focus-module.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('concatenated'));
});

gulp.task('babel', () =>
    gulp.src(['src/carouselModule/custom-carousel.js', 'src/carouselModule/focus-module.js', 'src/carouselModule/carousel-buttons.js'])
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest('dist/carouselModule'))
);
gulp.task('js', gulp.series(['concat', 'babel']));
/*********************************/
gulp.task('sass', function () {
    return gulp.src('./sass/main.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});



gulp.task('serve', gulp.series(["sass"], function () {
    browserSync.init({
        server: './src'
    });
    gulp.watch('./sass/main.scss', gulp.series('sass'));
    gulp.watch('./src/*.html').on('change', browserSync.reload);
    gulp.watch('./src/*.js').on('change', browserSync.reload);
}));

gulp.task('default', gulp.series('serve'));
