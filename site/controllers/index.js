var express = require( 'express' ),
	router  = express.Router();

router.get( '/', function( request, response )
{
	response.render( 'index/index.jade', {} );
} );

module.exports = router;