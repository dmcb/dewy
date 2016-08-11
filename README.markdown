![Dewy](static/img/dewy.png "Dewy")

# Dewy website

## Installation

* Configure OAuth client secret and JWT encryption:

        cp config.json.default config.json

* Install dependencies:

        npm install

* Run bower to download packages:

        bower install

* Run grunt to compile assets:

    * On development run grunt to build assets and watch for changes to files during development:

            grunt

    * On production run grunt to build assets with production values, this will not watch for file changes as files shouldn't change in production:

            grunt production

## Usage

### Development

* Run node:

        npm start

* Go to localhost:3000 to visit the site

### Production

* Run node, specifying that the environment is production:

        NODE_ENV=production npm start

* Alternatively, if it is preferred to specify the environment outside of the run command, run:

        export NODE_ENV=production
        npm start