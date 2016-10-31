// gulp
var gulp = require('gulp');
var path = require('path');

// plugins
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var gulpWebpack = require('gulp-webpack');
var livereload = require('gulp-livereload');
var webpack = require('webpack');

// tasks
gulp.task('clean', function() {
    gulp.src('./dist/*')
      .pipe(clean({force: true}));
});
// This is a relatively simple config. We'll add more stuff later.
var webpackConfig = {
    debug: true,
    watch: true,
    // this is the "entry" file of your app. Think of it as your Angular "app.js" file.
    entry: "./src/app.js",
    // this is the will-be-outputted file you'll reference in your index.html file
    output: {
        filename: "bundle.js",
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: "ng-cache-loader" },
            { test: /\.scss$/, loader: "style-loader!css-loader!autoprefixer-loader!sass-loader"},
            { test: /\.png$/, loader: "url-loader?limit=100000&mimetype=image/png" },
            { test: /\.jpg$/, loader: "file-loader" },
        ]
    },
    resolve: {
        // for illustration purposes, let's use lodash.
        // this tells Webpack where actually to find lodash because you'll need it in the ProvidePlugin
        alias: {
            lodash: path.resolve( __dirname, './node_modules/lodash-node/modern'),
        }
    },
    plugins: [
        // this tells Webpack to provide the "_" variable globally in all your app files as lodash.
        new webpack.ProvidePlugin({         
            _: "lodash",
        })
    ]
};

// this tells gulp to take the index.js file and send it to Webpack along with the config and put the resulting files in dist/
gulp.task("webpack", function() {
    return gulp.src('src/app.js')
    .pipe( gulpWebpack(webpackConfig, webpack) )
    .pipe(gulp.dest('dist/'))
});

gulp.task("copyIndex", function() {
   return gulp.src('src/index.html')
   .pipe(gulp.dest('dist/'));
});

// this should look familiar: start the server
gulp.task('serve', ['connect'], function () {
        require('opn')('http://localhost:9000');
});

// this is a somewhat fancy bit of URL rewriting to make the SPA 
// basically, it rewrites all requests so that the server sends the index page
// and lets the angular client-side routing take over
gulp.task('connect', function () {
        var connect = require('connect');
        var app = connect()
                .use(require('connect-livereload')({ port: 35729 }))
                .use(require('connect-modrewrite')([
                        '!(\\..+)$ / [L]',
                ]))
                .use(connect.static('dist'))
                .use(connect.directory('dist'));

        require('http').createServer(app)
                .listen(9000)
                .on('listening', function () {
                        console.log('Started connect web server on http://localhost:9000');
                });
});

// another familiar task: gulp is watching the dist/ folder for changes - whenever the dist/ changes, gulp reloads the page
gulp.task('watch', ['connect', 'serve'], function () {
        var server = livereload({ start: true });

        // watch for changes
        gulp.watch([
            'dist/bundle.js',
            'dist/index.html'
        ]).on('change', function (file) {
                server();
                //server.changed(file.path);
        });

        // run webpack whenever the source files changes
        // this next set of watches tells gulp to run webpack 
        // whenever the source files change and copy the new index html over
        gulp.watch('src/modules/**/*', ['webpack']);
        gulp.watch('src/index.html', ['copyIndex']);
});

