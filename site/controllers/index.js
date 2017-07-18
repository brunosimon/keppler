const express = require('express')
const router  = express.Router()

router.get('/', function(request, response)
{
    response.render('pages/index/projects.pug', {})
})

router.get(/project\/(.+)/, function(request, response)
{
    response.render(
        'pages/index/project.pug',
        {
            projectSlug: request.params['0']
        }
    )
})

module.exports = router
