module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'

    coffee:
      src:
        options:
          bare: true
        files:
          'lib/snap.js': 'src/snap.coffee'
      spec:
        files:
          'spec/snap-spec.js': 'spec/snap-spec.coffee'

    umd:
      all:
        src: 'lib/snap.js'
        template: 'umd.hbs'
        amdModuleId: 'simple-snap'
        objectToExport: 'snap'
        globalAlias: 'snap'
        deps:
          'default': ['$', 'SimpleModule', 'SimpleDragdrop']
          amd: ['jquery', 'simple-module', 'simple-dragdrop']
          cjs: ['jquery', 'simple-module', 'simple-dragdrop']
          global:
            items: ['jQuery', 'SimpleModule', 'simple.dragdrop']
            prefix: ''

    watch:
      styles:
        files: ['styles/*.scss']
        tasks: ['sass']
      spec:
        files: ['spec/**/*.coffee']
        tasks: ['coffee:spec']
      src:
        files: ['src/**/*.coffee']
        tasks: ['coffee:src', 'umd']
      jasmine:
        files: ['lib/**/*.js', 'specs/**/*.js']
        tasks: 'jasmine:test:build'

    jasmine:
      test:
        src: ['lib/**/*.js']
        options:
          outfile: 'spec/index.html'
          specs: 'spec/dragdrop-spec.js'
          vendor: [
            'vendor/bower/jquery/dist/jquery.min.js'
            'vendor/bower/simple-module/lib/module.js'
            'vendor/bower/simple-dragdrop/lib/dragdrop.js'
          ]

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-umd'

  grunt.registerTask 'default', ['coffee', 'umd', 'jasmine:test:build', 'watch']
  grunt.registerTask 'test', ['coffee', 'umd', 'jasmine:test']