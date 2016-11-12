"use strict";

const gulp = require('gulp'),
    webpack = require('gulp-webpack'),
    webpackConfig = require('./webpack.config'),
    browerSync = require('browser-sync').create(),
    gulpSync = require('gulp-sync')(gulp),
    server = require('gulp-develop-server'),
    clean = require('gulp-clean'),
    imageMin = require('gulp-imagemin'),
    uglify = require('gulp-uglify');

gulp.task('brower-sync', () => {
    browerSync.init({
        proxy: 'https://localhost:8000',
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
        'src/routes*/**/*',
        'src/routes*/routers*/api*/*',
        '!src/public/images',
        'src/public*/**/*',
        'src/views*/*',
        'src/views*/include*/*.pug',
        'src/config*/env/*',
        'src/config*/*'
        ])
        .pipe(gulp.dest('./'));
})

gulp.task('clean:front-end', () => {
    return gulp.src(['!public/attachments', '!public/images', '!public/lib', '!public/resources', 'public/*', 'views/*'], {read: false})
        .pipe(clean());
});

gulp.task('clean:back-end', () => {
    return gulp.src(['route/*', '!models/db.js']).pipe(clean());
});

gulp.task('clean', ['clean:back-end', 'clean:front-end']);

gulp.task('reload', () => {
    console.log('asdsd');
    setTimeout(() => {
      browerSync.reload();
    }, 2000);
});

gulp.task('server-start', (cb) => {
    server.listen({ path: './app.js' });
    // setTimeout(() => {
    //     cb(null);
    // }, 200);
    cb(null);
});

gulp.task('server-restart', () => {
    // setTimeout(() => {
    //     server.restart();
    // }, 200);
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
        'src/routes/*.js',
        'src/routes/**/*.js',
        'src/routes/routers/api/*.js'], gulpSync.sync(['copy', 'server-restart', 'reload']));

});

gulp.task('minify:image', () => {
    return gulp.src('public/images/*')
      .pipe(imageMin())
      .pipe(gulp.dest('public/images'));
});

gulp.task('minify:js', () => {
    return gulp.src('public/dist/*.js')
      .pipe(uglify())
      .pipe(gulp.dest('public/dist'));
});

gulp.task('apply-prod-environment', () => {
    process.env.NODE_ENV = 'production';
});

gulp.task('minify', ['minify:image', 'minify:js']);

gulp.task('dev', gulpSync.sync(['clean', 'copy', 'webpack', 'watch', 'server-start', 'brower-sync']));

gulp.task('default', gulpSync.sync(['apply-prod-environment', 'clean', 'copy', 'webpack', 'minify']));
