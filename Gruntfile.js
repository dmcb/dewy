module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: grunt.file.readJSON('config.json'),

    jekyll: {
      development: {
        options: {
          config: '_config.yml,_config.development.yml'
        }
      },
      production: {
        options: {
          config: '_config.yml'
        }
      }
    },

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
      development: {
        options: {
          sourceMap: false
        },
        src: [
          '.tmp/bower.js',
          'src/_js/app.js',
          'src/_js/services.js',
          'src/_js/factories.js',
          'src/_js/directives.js',
          'src/_js/controllers.js',
          'src/_js/site.js',
          '.tmp/config.js'
        ],
        dest: '_site/js/scripts.min.js'
      },
      production: {
        options: {
          sourceMap: true
        },
        src: [
          '.tmp/bower.js',
          'src/_js/app.js',
          'src/_js/services.js',
          'src/_js/factories.js',
          'src/_js/directives.js',
          'src/_js/controllers.js',
          'src/_js/site.js',
          '.tmp/config.js'
        ],
        dest: '.tmp/scripts.js'
      }
    },

    uglify: {
      all: {
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
          dest: '_site/js',
          ext: '.min.js'
        }]
      }
    },

    sass: {
      development: {
        options: {
          sourceMap: false
        },
        files: [{
          expand: true,
          cwd: 'src/_scss/',
          src: ['*.scss'],
          dest: '_site/css/',
          ext: '.css'
        }]
      },
      production: {
        options: {
          sourceMap: true,
          outputStyle: 'compressed',
        },
        files: [{
          expand: true,
          cwd: 'src/_scss/',
          src: ['*.scss'],
          dest: '_site/css/',
          ext: '.css'
        }]
      }
    },

    watch: {
      grunt: {
        files: ['Gruntfile.js']
      },

      jekyll: {
        files: ['src/**/*.{html,yml,md,mkd,markdown}'],
        tasks: ['jekyll:development', 'concat:development', 'sass:development']
      },

      scripts: {
        files: ['config.json', 'src/_js/**/*.js', '.tmp/config.js'],
        tasks: ['concat:development']
      },

      sass: {
        files: 'src/_scss/**/*.scss',
        tasks: ['sass:development'],
        options: {
          livereload: true,
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('production', ['jekyll:production', 'ngconstant:production', 'bower_concat', 'concat:production', 'uglify', 'sass:production']);
  grunt.registerTask('build', ['jekyll:development', 'ngconstant:development', 'bower_concat', 'concat:development', 'sass:development']);
  grunt.registerTask('default', ['build', 'watch']);
}