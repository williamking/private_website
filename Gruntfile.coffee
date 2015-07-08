module.exports = (grunt)-> 
	grunt.initConfig
      pkg: grunt.file.readJSON 'package.json'

      sass:
        dist:
            files: [
              expand: true,
              cwd: 'public/sass/',
              src: '**/*.sass',
              dest: 'public/stylesheets/',
              ext: '.css'
            ]

      livescript:
        dist:
          files: [
            expand: true,
            cwd: 'public/ls/',
            src: '**/*.ls',
            dest: 'public/javascripts/',
            ext: '.js'
          ]
        src:
          files:
            'public/app.js' : 'app.ls'

      watch:
        compile:
      	  options:
      	    spawn: false
          files: [
              'public/sass/**/*.sass',
              'public/app.js',
              'public/ls/*8/*.ls'
          ]
          tasks: ['livescript', 'sass']

    grunt.loadNpmTasks 'grunt-contrib-clean'
    grunt.loadNpmTasks 'grunt-contrib-concat'
    grunt.loadNpmTasks 'grunt-contrib-uglify'
    grunt.loadNpmTasks 'grunt-contrib-jshint'
    grunt.loadNpmTasks 'grunt-contrib-watch'
    grunt.loadNpmTasks 'grunt-contrib-sass'
    grunt.loadNpmTasks 'grunt-contrib-coffee'
    grunt.loadNpmTasks 'grunt-express-server'
    grunt.loadNpmTasks 'grunt-livescript'

    grunt.registerTask 'default', ['livescript', 'watch']
