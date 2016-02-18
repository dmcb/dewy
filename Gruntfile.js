module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    bower_concat: {
      all: {
        dest: {
          'js': 'static/js/vendor/bower.js'
        },
        bowerOptions: {
          relative: false
        }
      }
    },

    uglify: {
       bower: {
        options: {
          mangle: true,
          compress: true
        },
        files: {
          'static/js/vendor/bower.min.js': 'static/js/vendor/bower.js'
        }
      }
    },

    sass: {
      options: {
        
      },
      dist: {
        options: {
          outputStyle: 'compressed'
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
      grunt: { files: ['Gruntfile.js'] },

      sass: {
        files: 'static/scss/*.scss',
        tasks: ['sass'],
        options: {
          livereload: true,
        },
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('build', ['bower_concat', 'uglify:bower', 'sass']);
  grunt.registerTask('default', ['build','watch']);
}