module.exports = (grunt) ->
  grunt.initConfig
    srcDir: "./src",
    assetDir: "./site",
    outputDir: "./public"

    coffee:
      options:
        join: true
      source:
        files: [
          src: "<%= srcDir %>/**/*.coffee",
          dest: "<%= outputDir %>/js/application.js"
        ]

    jade:
      options:
        pretty: true

      source:
        files: [
          src: "<%= assetDir %>/index.jade",
          dest: "<%= outputDir %>/index.html",
        ]

    less:
      options:
        paths: ["<%= assetDir %>/stylesheets"]

      source:
        files: [
          src: "<%= assetDir %>/stylesheets/application.less"
          dest: "<%= outputDir %>/css/application.css"
        ]

    copy:
      vendor:
        files: [
          expand: true,
          cwd: "<%= assetDir %>/vendor",
          src: ["**/*"],
          dest: "<%= outputDir %>/js"
        ]

      images:
        files: [
          expand: true,
          cwd: "<%= assetDir %>/images",
          src: ["**/*"],
          dest: "<%= outputDir %>/images"
        ]

      content:
        files: [
          expand: true,
          cwd: "<%= assetDir %>/content",
          src: ["**/*"],
          dest: "<%= outputDir %>"
        ]

      fonts:
        files: [
          expand: true,
          cwd: "<%= assetDir %>/font",
          src: ["**/*"],
          dest: "<%= outputDir %>/font"
        ]

      css:
        files: [
          expand: true,
          cwd: "<%= assetDir %>/stylesheets",
          src: ["**/*.css"],
          dest: "<%= outputDir %>/css"
        ]

    clean:
      output: ["<%= outputDir %>"]

    watch:
      coffee:
        files: "<%= srcDir %>/**/*.coffee",
        tasks: ["coffee:source"]

      jade:
        files: "<%= assetDir %>/**/*.jade"
        tasks: ["jade:source"]

      less:
        files: "<%= assetDir %>/stylesheets/**/*.less"
        tasks: ["less:source"]

      vendor:
        files: "<%= assetDir %>/vendor/**/*"
        tasks: ["copy:vendor"]

      images:
        files: "<%= assetDir %>/images/**/*"
        tasks: ["copy:images"]

      content:
        files: "<%= assetDir %>/content/**/*"
        tasks: ["copy:content"]

      css:
        files: "<%= assetDir %>/stylesheets/**/*.css"
        tasks: ["copy:css"]

      fonts:
        files: "<%= assetDir %>/font/**/*"
        tasks: ["copy:fonts"]

    connect:
      server:
        options:
          port: 9876
          hostname: "0.0.0.0"
          base: "./public"
          keepalive: true

    exec:
      server:
        cmd: "./server.js"

  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-jade"
  grunt.loadNpmTasks "grunt-contrib-less"
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-exec"


  grunt.registerTask "build", ["clean", "coffee:source", "jade:source", "less:source",  "copy:vendor", "copy:images", "copy:content", "copy:fonts", "copy:css"]
  grunt.registerTask "default", ["build"]
  grunt.registerTask "server", ["exec:server"]
