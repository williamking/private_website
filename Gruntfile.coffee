module.exports = (grunt)-> 
	grunt.initConfig
      pkg: grunt.file.readJSON 'package.json'

      clean:
        bin:
          files: [
            expand: true,
            src: 'bin/*'
          ]

      copy:
        clone:
          files: [
            expand: true,
            cwd: 'src',
            src: ['**/*.*', '!**/**.{sass, ls}', '!*.{sass, ls}'],
            dest: 'bin/'
          ]

      sass:
        dist:
            files: [
              expand: true,
              cwd: 'src/public/sass',
              src: '*.sass',
              dest: 'bin/public/sass',
              ext: '.css'
            ]

      livescript:
        dist:
          files: [
            expand: true,
            cwd: 'src',
            src: ['public/**/*.ls', 'routes/**/*.ls', 'models/*.ls', '*.ls']
            dest: 'bin/',
            ext: '.js'
          ]

      concat:
          options:
              separator: '\n'
              stripBanners: true
              banner: '/* Created by William */\n'
          js:
              src: ['bin/public/ls/*.js'],
              dest: 'bin/public/javascripts/all.js'
          css:
              src: ['bin/public/sass/*.css']
              dest: 'bin/public/stylesheets/style.css'

      watch:
        compile:
      	  options:
      	    spawn: false
          files: [
              'src/*.sass'
              'src/*.ls'
              'src/**/*.ls'
              'src/**/*.sass'
              'src/app.ls'
              'src/views/*.jade'
          ]
          tasks: ['livescript', 'sass', 'copy', 'concat', 'express']

      express:
        dev:
          options:
            script: 'bin/app.js'

    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-jshint'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-contrib-copy'
    grunt.loadNpmTasks 'grunt-contrib-sass'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-express-server'
    grunt.loadNpmTasks 'grunt-livescript'

    grunt.registerTask 'default', ['clean', 'livescript', 'sass', 'copy', 'concat', 'express', 'watch']
