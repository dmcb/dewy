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
          dest: '.tmp/config.js'
        },
        constants: {
          ENV: {
            api: '<%= config.development.api.url %>', 
            client_id: '<%= config.development.client.client_id %>', 
            client_secret: '<%= config.development.client.client_secret %>', 
            stripePublicKey: '<%= config.development.stripe.public_key %>',
            environment: 'development'
          }
        }
      },
      production: {
        options: {
          dest: '.tmp/config.js'
        },
        constants: {
          ENV: {
            api: '<%= config.production.api.url %>', 
            client_id: '<%= config.production.client.client_id %>', 
            client_secret: '<%= config.production.client.client_secret %>', 
            stripePublicKey: '<%= config.production.stripe.public_key %>',
            environment: 'production'
          }
        }
      }
    },

    bower_concat: {
      all: {
        dest: {
          'js': '.tmp/bower.js'
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

    concat: {
      all: {
        options: {
          sourceMap: true
        },
        src: [
          '.tmp/bower.js',
          'src/js/app.js',
          'src/js/services.js',
          'src/js/factories.js',
          'src/js/directives.js',
          'src/js/controllers.js',
          'src/js/site.js',
          '.tmp/config.js'
        ],
        dest: '.tmp/scripts.js'
      }
    },

    uglify: {
      development: {
        options: {
          sourceMap: true,
          sourceMapIncludeSources : true,
          sourceMapIn: '.tmp/scripts.js.map',
          mangle: true,
          compress: true
        },
        files: [{
          expand: true,
          cwd: '.tmp',
          src: ['scripts.js'],
          dest: 'static/js',
          ext: '.min.js'
        }]
      },
      production: {
        options: {
          sourceMap: false,
          mangle: true,
          compress: true
        },
        files: [{
          expand: true,
          cwd: 'static/js',
          src: ['scripts.js'],
          dest: 'static/js',
          ext: '.min.js'
        }]
      }
    },

    sass: {
      development: {
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
      },
      production: {
        options: {
          sourceMap: false,
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
        files: ['src/js/**/*.js', '!static/js/**/*.min.js'],
        tasks: ['concat', 'uglify']
      },

      sass: {
        files: 'src/scss/**/*.scss',
        tasks: ['sass'],
        options: {
          livereload: true,
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('production', ['ngconstant:production', 'bower_concat', 'concat', 'uglify:production', 'sass:production']);
  grunt.registerTask('build', ['ngconstant:development', 'bower_concat', 'concat', 'uglify:development', 'sass:development']);
  grunt.registerTask('default', ['build','watch']);
}