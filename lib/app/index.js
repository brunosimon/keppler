'use strict'

// Depedencies
const ip = require('ip')
const Site = require('./site')
const Watcher = require('./watcher')
const defaultConfig = require('./config.default.json')

/**
 * App class
 */
class App
{
    /**
     * Constructor
     */
    constructor(_options)
    {
        this.setArguments()
        this.setOptions(_options)
        this.setSite()
        this.setWatcher()
    }

    /**
     * Set options
     */
    setOptions(_options)
    {
        const options = typeof _options === 'object' ? _options : {}
        
        // Defaults
        if(typeof options.debug === 'undefined')
        {
            if(this.arguments.length > 1)
            {
                options.debug = this.arguments[ this.arguments.length - 1 ] === 'true'
            }
            else
            {
                options.debug = defaultConfig.debug
            }
        }

        if(typeof options.port === 'undefined')
        {
            options.port = defaultConfig.port
        }

        if(typeof options.domain === 'undefined')
        {
            options.domain = `http://${ip.address()}:${options.port}`
        }

        if(typeof options.maxFileSize === 'undefined')
        {
            options.maxFileSize = defaultConfig.maxFileSize
        }

        if(typeof options.exclude === 'undefined')
        {
            options.exclude = defaultConfig.exclude
        }

        // Save
        this.options = options
    }

    /**
     * Set arguments
     * Retrieve arguments and test if missing
     */
    setArguments()
    {
        // Set up
        this.arguments = process.argv.slice(2)

        // Missing project name
        if(this.arguments.length === 0)
        {
            // Stop process
            throw new Error('Missing arguments: first argument should be the projet name'.red)
        }
    }

    /**
     * Set site
     * Instantiate site
     */
    setSite()
    {
        this.site = new Site({
            port  : this.options.port,
            domain: this.options.domain,
            debug : this.options.debug
        })
    }

    /**
     * Set watcher
     * Instantiate watcher
     */
    setWatcher()
    {
        this.watcher = new Watcher({
            port         : this.options.port,
            domain       : this.options.domain,
            debug        : this.options.debug,
            maxFileSize: this.options.maxFileSize,
            exclude      : this.options.exclude,
            name         : this.arguments[ 0 ]
        })
    }
}

module.exports = App
