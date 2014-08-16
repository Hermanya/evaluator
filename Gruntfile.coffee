module.exports = (grunt) ->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    watch:
      options:
        livereload: true
      coffee:
        files: 'src/**/*.coffee'
        tasks: ['coffeelint','coffeeify','mocha']
    coffeelint:
      app: ['src/**/*.coffee']
      options:
        configFile: 'coffeelint.json'
    coffeeify:
      options:
        debug: true
      files:
        src: 'src/**/*.coffee',
        dest: 'script.js'
    mocha:
      all:
        src: ['index.html']
      options:
        run: true

  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-coffeeify'
  grunt.loadNpmTasks 'grunt-mocha'
  grunt.registerTask 'default',
    ['coffeelint','coffeeify','mocha','watch']
