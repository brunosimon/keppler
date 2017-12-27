// Dependencies
const express = require('express')
const helmet = require('helmet')
const http = require('http')
const path = require('path')
const chalk = require('chalk')

/**
 * Site class
 */
class Site
{
    /**
     * Constructor
     */
    constructor(_config, _success, _alreadyRunning, _error)
    {
        this.config = _config
        this.success = _success
        this.alreadyRunning = _alreadyRunning
        this.error = _error

        this.setExpress()
        this.setServer()
    }

    /**
     * Set express
     * Start express and set controllers
     */
    setExpress()
    {
        // Set up
        this.express = express()
        this.express.use(helmet())
        this.express.set('view engine', 'pug')
        this.express.set('views', path.join(__dirname, 'views'))
    }

    /**
     * Set server
     */
    setServer()
    {
        // Set up
        this.server = http.createServer(this.express)

        // Error event
        this.server.on('error', (error) =>
        {
            // Server already running
            if(error.code === 'EADDRINUSE')
            {
                if(this.config.debug >= 1)
                {
                    console.log(`${chalk.green.bold('site')} - ${chalk.cyan('already running')}`)
                }

                // Callback
                if(typeof this.alreadyRunning === 'function')
                {
                    this.alreadyRunning()
                }

                return
            }
            else
            {
                if(this.config.debug >= 1)
                {
                    console.log(`${chalk.green.bold('site')} - ${chalk.cyan('unknown error')}`)
                    console.log(error)
                }

                // Callback
                if(typeof this.error === 'function')
                {
                    this.alreadyRunning()
                }
            }
        })

        // Start
        this.server.listen(this.config.port, () =>
        {
            // URL
            if(this.config.debug >= 1)
            {
                console.log(`${chalk.green.bold('site')} - ${chalk.cyan('started')}`)
            }

            if(typeof this.success === 'function')
            {
                this.success()
            }
        })
    }

    /**
     * Create project
     */
    createProjectRoute(_project)
    {
        this.express.use('/', express.static(path.join(__dirname, '../app/dist')))

        // Project download route
        this.express.get('/' + _project.slug + '/download', (request, response) =>
        {
            // Get zip buffer
            const zipBuffer = _project.getZipBuffer()

            // Set finename
            const date = new Date()
            const hours = `${date.getHours() < 10 ? '0' : ''}${date.getHours()}`
            const minutes = `${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`
            const seconds = `${date.getSeconds() < 10 ? '0' : ''}${date.getSeconds()}`
            const name = `${_project.slug}_${hours}-${minutes}-${seconds}.zip`

            response.setHeader('Content-disposition', `attachment; filename=${name}`)

            zipBuffer.pipe(response)
        })

        this.express.use('/' + _project.slug + '/files', express.static(_project.path))
    }
}

module.exports = Site
