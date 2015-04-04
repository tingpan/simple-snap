module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'

    coffee:
      src:
        options:
          bare: true
        files:
          'lib/snap.js': 'src/snap.coffee'
    watch:
      src:
        files: ['src/*.coffee','demo.html']
        tasks: ['coffee:src', 'umd']

    umd:
      all:
        src: 'lib/snap.js'
        template: 'umd'
        amdModuleId: 'simple-snap'
        objectToExport: 'snap'
        globalAlias: 'snap'
        deps:
          'default': ['$', 'SimpleModule','dragdrop']
          amd: ['jquery', 'simple-module', 'simple-dragdrop']
          cjs: ['jquery', 'simple-module', 'simple-dragdrop']
          global:
            items: ['jQuery', 'SimpleModule','dragdrop']
            prefix: ''

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-umd'

  grunt.registerTask 'default', ['coffee', 'umd', 'watch']