var gulp            = require( 'gulp' ),
    concat          = require( 'gulp-concat' ),
    uglify          = require( 'gulp-uglify' ),
    watch           = require( 'gulp-watch' ),
    minify_css      = require( 'gulp-minify-css' ),
    autoprefixer    = require( 'gulp-autoprefixer' ),
    postcss         = require( 'gulp-postcss' ),
    precss          = require( 'precss' ),
    postcss_import  = require( 'postcss-import' ),
    cssnano         = require( 'cssnano' ),
    sourcemaps      = require( 'gulp-sourcemaps' ),
    spritesmith     = require( 'gulp.spritesmith' ),
    merge           = require( 'merge-stream' ),
    plumber         = require( 'gulp-plumber' ),
    gulp_rename     = require( 'gulp-rename' ),
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
    var requires = [
        autoprefixer,
        precss,
        postcss_import,
        cssnano,
    ];

    // Post CSS
    return gulp.src( path + 'stylesheet/main.css' )
        .pipe( sourcemaps.init() )
        .pipe( plumber( function( error )
        {
            console.log( error );
            this.emit( 'end' );
        } ) )
        .pipe( postcss( requires ) )
        .pipe( gulp_rename( {
            // dirname: "main/text/ciao",
            // basename: "aloha",
            // prefix: "bonjour-",
            suffix: ".min",
            // extname: ".md"
        } ) )
        .pipe( sourcemaps.write( '.' ) )
        .pipe( gulp.dest( path + 'stylesheet/' ) )
        .pipe( browser_sync.stream( { match: '**/*.css' } ) );
});

/**
 * SPRITES
 */
gulp.task( 'sprites', function()
{
    var sprite_data = gulp.src( path + 'images/sprites/**/*.{png,jpg}' )
        .pipe( plumber() )
        .pipe( spritesmith( {

            // Options
            padding : 4,

            // Default
            imgName : 'sprites.png',
            cssName : '_sprites.scss',
            imgPath : path + 'images/sprites.png',

            // Retina
            retinaSrcFilter: [path + 'images/sprites/*-2x.png'],
            retinaImgName: 'sprites-2x.png',
            retinaImgPath: path + 'images/sprites-2x.png'
        } ) );

    var img_stream = sprite_data.img
        .pipe( plumber() )
        .pipe( gulp.dest( path + 'images/' ) );

    var css_stream = sprite_data.css
        .pipe( plumber() )
        .pipe( gulp.dest( path + 'sass/base/' ) );

    return merge( img_stream, css_stream );
});

/**
 * Browser Sync
 */
gulp.task( 'browser_sync', function()
{
    browser_sync.init( {
        proxy:
        {
            target: 'http://localhost:3000',
            ws    : true
        }
    } );
} );

/**
 * WATCH
 */
gulp.task( 'watch', function()
{
    console.log('ok');
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
            path + 'stylesheet/**',
            '!' + path + 'stylesheet/main.min.css',
            '!' + path + 'stylesheet/main.min.css.map'
        ],
        function()
        {
            gulp.start( 'stylesheet');
        }
    );
} );


gulp.task( 'start', [ 'default', 'watch', 'browser_sync' ] );
gulp.task( 'default', [ /*'javascript',*/ 'stylesheet' ] );
