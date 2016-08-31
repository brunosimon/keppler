var gulp            = require( 'gulp' ),
    concat          = require( 'gulp-concat' ),
    uglify          = require( 'gulp-uglify' ),
    watch           = require( 'gulp-watch' ),
    gulp_sourcemaps = require( 'gulp-sourcemaps' ),
    plumber         = require( 'gulp-plumber' ),
    gulp_rename     = require( 'gulp-rename' ),
    gulp_stylus     = require( 'gulp-stylus' ),
    nib             = require( 'nib' ),
    browser_sync    = require( 'browser-sync' ).create();

var path = '../';

// /**
//  * Javascript
//  */
// gulp.task( 'javascript', function()
// {
//     gulp.src([
//         path + '/javascript/libraries/jquery-3.0.0.js',
//         path + '/javascript/libraries/burno-0.3.js',
//         path + '/javascript/libraries/fastclick.js',
//         path + '/javascript/libraries/q.js',
//         path + '/javascript/libraries/hammer.min.js',
//         path + '/javascript/application/application.class.js',
//         path + '/javascript/application/tools/ajax.class.js',
//         path + '/javascript/application/tools/manager.class.js',
//         path + '/javascript/application/tools/loader.class.js',
//         path + '/javascript/application/tools/navigation.class.js',
//         path + '/javascript/application/tools/parallax.class.js',
//         path + '/javascript/application/tools/scroller.class.js',
//     ])
//     .pipe( concat( 'main.min.js' ) )
//     .pipe( uglify() )
//     .pipe( gulp.dest( path + 'javascript/' ) )
//     .pipe( browser_sync.stream() );
// });

gulp.task( 'stylesheet', function()
{
    return gulp.src( path + 'stylus/style.styl' )
        .pipe( gulp_sourcemaps.init() )
        .pipe( plumber() )
        .pipe( gulp_stylus( {
            use     : nib(),
            compress: true,
        } ) )
        .pipe( gulp_sourcemaps.write( '.' ) )
        .pipe( gulp.dest( path + 'stylesheet' ) )
        .pipe( browser_sync.stream( { match: '**/*.css' } ) );


    // var requires = [
    //     autoprefixer,
    //     precss,
    //     postcss_import,
    //     cssnano,
    // ];

    // // Post CSS
    // return gulp.src( path + 'stylesheet/main.css' )
    //     .pipe( gulp_sourcemaps.init() )
    //     .pipe( plumber( function( error )
    //     {
    //         console.log( error );
    //         this.emit( 'end' );
    //     } ) )
    //     .pipe( postcss( requires ) )
    //     .pipe( gulp_rename( {
    //         // dirname: "main/text/ciao",
    //         // basename: "aloha",
    //         // prefix: "bonjour-",
    //         suffix: '.min',
    //         // extname: ".md"
    //     } ) )
    //     .pipe( gulp_sourcemaps.write( '.' ) )
    //     .pipe( gulp.dest( path + 'stylesheet/' ) )
    //     .pipe( browser_sync.stream( { match: '**/*.css' } ) );
});

/**
 * Browser Sync
 */
gulp.task( 'browser_sync', function()
{
    console.log('ok');
    browser_sync.init( {
        proxy:
        {
            target: 'http://localhost:1571',
            ws    : true
        }
    } );
} );

/**
 * WATCH
 */
gulp.task( 'watch', function()
{
    // // JS
    // watch(
    //     [
    //         path + 'javascript/**',
    //         '!' + path + 'javascript/main.min.js'
    //     ],
    //     function()
    //     {
    //         gulp.start( 'javascript' );
    //     } );

    // Stylesheet
    watch(
        [
            path + 'stylus/**',
        ],
        function()
        {
            gulp.start( 'stylesheet');
        }
    );
} );


gulp.task( 'start', [ 'default', 'watch', 'browser_sync' ] );
gulp.task( 'default', [ /*'javascript',*/ 'stylesheet' ] );
