var gulp = require('gulp'),
    clean = require('gulp-clean'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    cssNano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    webpack = require('webpack-stream'),
    IgnorePlugin = require('webpack-stream').webpack.IgnorePlugin;

var basepaths = {
    src: 'source',
    dest: '.'
}

var paths = {
    js: {
        src: basepaths.src + '/js',
        dest: basepaths.dest + '/js',
        node: basepaths.dest + '/node_modules'
    },
    css: {
        src: basepaths.src + '/scss',
        dest: basepaths.dest
    }
};

/*
 Styles - Clean
 */
gulp.task('clean-styles', function () {
    return gulp.src([paths.css.dest + '/style.css', paths.css.dest + '/style.css.map'], { read: false })
        .pipe(clean());
});
/*
 Scripts - Clean
 */
gulp.task('clean-scripts', function () {
    return gulp.src([paths.js.dest + '/app.min.js', paths.js.dest + '/app.min.js.map'], { read: false })
        .pipe(clean());
});
/*
 Scripts - Hint
 */
gulp.task('hint', function () {
    return gulp.src(paths.js.src + '/**/*.js')
        .pipe(jshint({ esversion: 9 }))
        .pipe(jshint.reporter(stylish))
        .pipe(jshint.reporter('fail'));
});
/*
 Styles Task
 */
gulp.task('styles', ['clean-styles'], function () {
    return gulp.src(paths.css.src + '/**/*.scss')
        .pipe(plumber({
            errorHandler: function (error) {
                console.log('Styles Error: ' + error.message);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer('last 2 version'))
        .pipe(cssNano({ zindex: false }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.css.dest));
});
/*
 Scripts - Concat and Uglify
 */
gulp.task('scripts', ['clean-scripts', 'hint'], function () {
    return gulp.src([
        // TODO importing node modules not yet setup
        // paths.js.node + '/supafolio-sdk/dist/supafolio.min.js',
        paths.js.node + '/babel-polyfill/dist/polyfill.min.js',
        paths.js.src + '/app.js'
    ])
        .pipe(plumber({
            errorHandler: function (error) {
                console.log('Scripts Error: ' + error.message);
                this.emit('end');
            }
        }))
        .pipe(webpack({
            externals: {
                jquery: 'jQuery'
            },
            output: {
                filename: 'app.min.js',
            },
            devtool: 'source-map',
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        // TODO importing node modules not yet setup
                        // exclude: /node_modules\/(?!(supafolio-sdk)\/).*/,
                        //include: /node_modules\/babel-polyfill\/dist\/polyfill.min.js/,
                        // exclude: /node_modules/,
                        use: {
                            loader: "babel-loader",
                            options: {
                                presets: ["babel-preset-env", "babel-preset-stage-3"]
                            }
                        }
                    }
                ]
            },
            plugins: [
                new IgnorePlugin({
                    resourceRegExp: /^\.\/scss$/,
                    contextRegExp: /style$/
                })
            ]
        }))
        // .pipe(uglify())
        .pipe(gulp.dest(paths.js.dest))
});
/*
 Default and Watch Task
 */
gulp.task('default', ['styles'], function () {
    gulp.watch(paths.css.src + '/**/*.scss', ['styles']);
    gulp.watch(paths.js.src + '/**/*.js', ['scripts']);
});
