module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: grunt.file.readJSON('config.json'),

    ngconstant: {
      options: {
        space: '  ',
        wrap: '"use strict";\n\n {\%= __ngModule %}',
        name: 'config'
      },
      development: {
        options: {
          dest: 'static/js/config.js'
        },
        constants: {
          ENV: {
            api: '<%= config.development.proxy_api.url %>', 
            stripePublicKey: '<%= config.development.stripe.public_key %>',
            environment: 'development'
          }
        }
      },
      production: {
        options: {
          dest: 'static/js/config.js'
        },
        constants: {
          ENV: {
            api: '<%= config.production.proxy_api.url %>', 
            stripePublicKey: '<%= config.production.stripe.public_key %>',
            environment: 'production'
          }
        }
      }
    },

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
          'angular-momentjs',
          'stripe-angular'
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
      build : {
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
      build: {
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

  grunt.registerTask('production', ['ngconstant:production', 'bower_concat', 'uglify', 'sass']);
  grunt.registerTask('build', ['ngconstant:development', 'bower_concat', 'uglify', 'sass']);
  grunt.registerTask('default', ['build','watch']);
}