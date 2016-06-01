// Depedencies
var chokidar = require( 'chokidar' ),
	path     = require( 'path' ),
	colors   = require( 'colors' );

// Working directory
var cwd = process.cwd();

// Watcher
var watcher = chokidar.watch(
		cwd,
		{
			ignored : /[\/\\]\./,
			ignoreInitial : true
		}
	);

watcher.on( 'add', ( path ) =>
{
	console.log( 'add:'.green.bold, path );
} );

watcher.on( 'change', ( path ) =>
{
	console.log( 'change:'.green.bold, path );
} );

watcher.on( 'unlink', ( path ) =>
{
	console.log( 'unlink:'.green.bold, path );
} );

watcher.on( 'addDir', ( path ) =>
{
	console.log( 'addDir:'.green.bold, path );
} );

watcher.on( 'unlinkDir', ( path ) =>
{
	console.log( 'unlinkDir:'.green.bold, path );
} );