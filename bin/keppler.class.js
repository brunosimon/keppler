'use strict'

// Depedencies
let path           = require( 'path' ),
    colors         = require( 'colors' ),
    ip             = require( 'ip' ),
    Site           = require( '../site/site.class.js' ),
    Watcher        = require( '../watcher/watcher.class.js' ),
    default_config = require( './config.default.json' )

/**
 * Keppler class
 */
class Keppler
{
    /**
     * Constructor
     */
    constructor( _options )
    {
        this.set_arguments()
        this.set_options( _options )
        this.set_site()
        this.set_watcher()
    }

    /**
     * Set options
     */
    set_options( _options )
    {
        // No option
        if( typeof _options !== 'object' )
            _options = {}

        // Defaults
        if( typeof _options.debug === 'undefined' )
        {
            if( this.arguments.length > 1 )
            {
                _options.debug = this.arguments[ this.arguments.length - 1 ] === 'true' ? true : false
            }
            else
            {
                _options.debug = default_config.debug
            }
        }

        if( typeof _options.port === 'undefined' )
            _options.port = default_config.port

        if( typeof _options.domain === 'undefined' )
            _options.domain = `http://${ip.address()}:${_options.port}`

        if( typeof _options.max_file_size === 'undefined' )
            _options.max_file_size = default_config.max_file_size

        if( typeof _options.exclude === 'undefined' )
            _options.exclude = default_config.exclude

        // Save
        this.options = _options
    }

    /**
     * Set arguments
     * Retrieve arguments and test if missing
     */
    set_arguments()
    {
        // Set up
        this.arguments = process.argv.slice( 2 )

        // Missing project name
        if( this.arguments.length === 0 )
        {
            // Stop process
            console.log( 'Missing arguments: first argument should be the projet name'.red )
            process.exit()
        }
    }

    /**
     * Set site
     * Instantiate site
     */
    set_site()
    {
        this.site = new Site( {
            port  : this.options.port,
            domain: this.options.domain,
            debug : this.options.debug
        } )
    }

    /**
     * Set watcher
     * Instantiate watcher
     */
    set_watcher()
    {
        this.watcher = new Watcher( {
            port         : this.options.port,
            domain       : this.options.domain,
            debug        : this.options.debug,
            max_file_size: this.options.max_file_size,
            exclude      : this.options.exclude,
            name         : this.arguments[ 0 ]
        } )
    }
}

module.exports = Keppler
