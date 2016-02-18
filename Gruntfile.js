module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    bower_concat: {
      all: {
        dest: {
          'js': 'src/js/bower.js'
        },
        include: [
          'angular-ui-sortable'
        ],
        bowerOptions: {
          relative: false
        }
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        mangle: true,
        compress: true
      },
      dist : {
        files: [{
          expand: true,
          cwd: 'src/js',
          src: ['*.js'],
          dest: 'static/js/',
        }]
      }
    },

    sass: {
      options: {
        
      },
      dist: {
        options: {
          sourceMap: true,
          outputStyle: 'compressed',

        },
        files: [{
          expand: true,
          cwd: 'src/scss/',
          src: ['*.scss'],
          dest: 'static/css/',
          ext: '.css'
        }]
      }
    },

    watch: {
      grunt: {files: ['Gruntfile.js']},

      scripts: {
        files: 'src/js/*.js',
        tasks: ['uglify']
      },

      sass: {
        files: 'src/scss/*.scss',
        tasks: ['sass'],
        options: {
          livereload: true,
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('build', ['bower_concat', 'uglify', 'sass']);
  grunt.registerTask('default', ['build','watch']);
}