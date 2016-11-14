ES6 Marionette project
======================
Looking for boilerplate projects to start working with ECMAScript 6 I didn't found a project that fit my requirements, so I take the best part of other projects and put all together here. This project can be used to bootstrap new projects with ECMAScript 6 support.

This is an implementation of [Clean ES6 Project](https://github.com/abiee/clean-es6-project) integrating Backbone.Marionette to the stack.

What's inside
----------------
Batteries included:
 - Gulp
 - Browserify
 - Babelify
 - Bootstrap
 - jQuery
 - Underscore
 - Backbone
 - Marionette
 - Handlebars
 - BrowserSync
 - Stylus
 - Karma
 - Mocha, Chai, Sinon

Setup
-----
Clone the repository and install the dependencies.

    $ git clone https://github.com/abiee/es6-marionette.git my-project
    $ cd my-project
    $ npm install
    $ gulp serve

Do not forget to install globally gulp if not installed yet.

Build
------
If you want to build the project run.

    $ gulp build

It will compile the project and put the result under `dist` directory. You can run the compiled project also.

    $ gulp serve:dist

Testing
---------
Two options exists to run tests, the first one is for development process and aims to practice Test Driven Development.

    $ gulp tdd

It will open a Google Chrome instance and run all tests on it, when a file is updated tests will be run again. You can see the rests as a notification or in the console.
The other option to run tests is for Continuous Integration purposes, it will run all the tests against PanthomJS and output a jUnit format file for analysis.

    $ gulp test

You can get the results at `.tmp/test-results.xml`.

Contribution
---------------
If you have ideas or find an error feel free to submit a PR.

Licence
-------
Licensed under the MIT license.
