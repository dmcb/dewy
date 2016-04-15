module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    bower_concat: {
      all: {
        dest: {
          'js': 'static/js/bower.js'
        },
        include: [
          'angular-flash',
          'angular-ui-sortable',
          'angular-validation-match',
          'moment',
          'angular-momentjs'
        ],
        mainFiles: {
          'moment': 'moment.js'
        },
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
          cwd: 'static/js',
          src: ['*.js', '!*.min.js'],
          dest: 'static/js',
          ext: '.min.js'
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
          cwd: 'static/scss/',
          src: ['*.scss'],
          dest: 'static/css/',
          ext: '.css'
        }]
      }
    },

    watch: {
      grunt: {files: ['Gruntfile.js']},

      scripts: {
        files: ['static/js/**/*.js', '!static/js/**/*.min.js'],
        tasks: ['uglify']
      },

      sass: {
        files: 'static/scss/**/*.scss',
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