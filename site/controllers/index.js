var express = require( 'express' ),
	router  = express.Router();

router.get( '/', function( request, response )
{
    response.render( 'pages/index/projects.jade', {} );
} );

router.get( /project\/[a-z]([a-z0-9_-])?/, function( request, response )
{
    response.render( 'pages/index/project.jade', {} );
} );

module.exports = router;
