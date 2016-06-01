var express = require( 'express' ),
	router  = express.Router();

router.get( '/', function( request, response )
{
	response.send( 'Hello' );
} );

module.exports = router;