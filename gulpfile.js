"use strict";

const gulp = require('gulp'),
    webpack = require('gulp-webpack'),
    webpackConfig = require('./webpack.config'),
    browerSync = require('browser-sync').create(),
    gulpSync = require('gulp-sync')(gulp),
    server = require('gulp-develop-server'),
    clean = require('gulp-clean');

gulp.task('brower-sync', () => {
    browerSync.init({
        server: {
            proxy: 'localhost:3000',
        },
    });
});

gulp.task('webpack', () => {
	gulp.src("./")
		.pipe(webpack(webpackConfig))
		.pipe(gulp.dest("./public/dist/"))
});

gulp.task('copy', () => {
    gulp.src(['src/models*/*', 'src/routes*/*', 'src/**/*', 'src/views*/*'])
        .pipe(gulp.dest('./'))
})

gulp.task('clean:front-end', () => {
    return gulp.src(['public/dist', 'views/*'], {read: false})
        .pipe(clean());
});

gulp.task('clean:back-end', () => {
    return gulp.src(['models/*', 'route/*']).pipe(clean());
});

gulp.task('clean', ['clean:back-end', 'clean:front-end']);

gulp.task('reload', () => {
    browerSync.reload();
});

gulp.task('server-start', () => {
    server.listen({ path: './app.js' });
});

gulp.task('server-restart', () => {
    server.restart();
})

gulp.task('watch', () => {

    // watch front-end file
    gulp.watch(['src/public/sass/*.sass',
        'src/public/**/*.js'], gulpSync.sync(['webpack', 'reload']));

    // watch back-end file
    gulp.watch(['src/models/*.js', 
        'src/routes/*.js', 'src/routes/**/*.js'], gulpSync.sync(['copy', 'server-restart', 'reload']));

});

gulp.task('default', ['clean', 'webpack', 'copy', 'server-start', 'watch']);