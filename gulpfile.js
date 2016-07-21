"use strict";

const gulp = require('gulp'),
    webpack = require('gulp-webpack'),
    webpackConfig = require('./webpack.config'),
    browerSync = require('browser-sync').create(),
    gulpSync = require('gulp-sync')(gulp),
    server = require('gulp-develop-server'),
    clean = require('gulp-clean');

gulp.task('brower-sync', ['copy'], () => {
    browerSync.init({
        proxy: 'http://localhost:8000',
    });
});

gulp.task('webpack', () => {
	return gulp.src("./")
	.pipe(webpack(webpackConfig))
		.pipe(gulp.dest("./public/dist/"));
});

gulp.task('copy', () => {
    return gulp.src(['src/models*/*',
        'src/routes*/*',
        'src/public*/**/*',
        'src/views*/*',
        'src/views*/include*/*.pug',
        '!src/public*/react_views*/*'])
        .pipe(gulp.dest('./'));
})

gulp.task('clean:front-end', () => {
    return gulp.src(['!public/lib', '!public/resources', 'public/*', 'views/*'], {read: false})
        .pipe(clean());
});

gulp.task('clean:back-end', () => {
    return gulp.src(['route/*', '!models/db.js']).pipe(clean());
});

gulp.task('clean', ['clean:back-end', 'clean:front-end']);

gulp.task('reload', () => {
    browerSync.reload();
});

gulp.task('server-start', (cb) => {
    server.listen({ path: './app.js' });
    setTimeout(function() {
        cb(null);
    }, 200);
});

gulp.task('server-restart', () => {
    server.restart();
})

gulp.task('watch', () => {

    // watch front-end file
    gulp.watch(['src/public/sass/*.sass',
        'src/public/**/*.js',
        'src/public/**/*.jsx',
        'src/views/*',
        'src/views/**/*'], gulpSync.sync(['copy', 'webpack', 'reload']));

    // watch back-end file
    gulp.watch(['src/models/*.js', 
        'src/routes/*.js', 'src/routes/**/*.js'], gulpSync.sync(['copy', 'server-restart', 'reload']));

});

gulp.task('default', gulpSync.sync(['clean', 'copy', 'webpack', 'watch', 'server-start', 'brower-sync']));