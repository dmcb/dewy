![Dewy](src/img/dewy.png "Dewy")

# Dewy website

## Pre-requisites

* Install NodeJS (OS X with [Homebrew](https://brew.sh)):

		$ brew update
		$ brew install node

* Install [Jekyll](https://jekyllrb.com/)

		$ gem install jekyll

## Installation

* Install dependencies:

        $ npm install

* Run Bower to download packages:

        $ bower install
        
* Configure OAuth client secret and JWT encryption:

        $ cp config.json.default config.json

## Development

* Run Grunt to compile Jekyll site and compile and add assets:

    * On development run Grunt to build assets and watch for changes to files during development:

            $ grunt

    * On production run Grunt to build assets with production values, this will not watch for file changes as files shouldn't change in production:

            $ grunt production

## Usage

* Run a web server with /_site as the web root
