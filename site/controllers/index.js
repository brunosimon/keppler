var express = require( 'express' ),
	router  = express.Router()

router.get( '/', function( request, response )
{
    response.render( 'pages/index/projects.jade', {} )
} )

router.get( /project\/(.+)/, function( request, response )
{
    response.render(
        'pages/index/project.jade',
        {
            project_slug: request.params['0']
        }
    )
} )

module.exports = router
