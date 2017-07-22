'use strict'

// Depedencies
const ip = require('ip')
const Site = require('./site')
const Watcher = require('./watcher.js')

/**
 * App class
 */
class App
{
    /**
     * Constructor
     */
    constructor()
    {
        this.setConfig()
        // this.setSite()
        this.setWatcher()
    }

    /**
     * Set config
     */
    setConfig()
    {
        const args = require('yargs')
            .option('debug', {
                alias: 'd',
                describe: 'Use debug mode',
                default: false,
                type: 'boolean'
            })
            .option('name', {
                alias: 'n',
                describe: 'Project name',
                default: '',
                type: 'string'
            })
            .option('port', {
                alias: 'p',
                describe: 'Port to use',
                default: 1571,
                type: 'number'
            })
            .option('exclude', {
                alias: 'e',
                describe: 'Files to exclude',
                default:
                [
                    '**/.DS_Store',
                    'node_modules/**',
                    'vendor/**',
                    '.git'
                ],
                type: 'array'
            })
            .option('initial-send', {
                alias: 'i',
                describe: 'Send current file in folder immediately',
                default: false,
                type: 'boolean'
            })
            .option('max-file-size', {
                alias: 'm',
                describe: 'Maximum file size in octets',
                default: 99999,
                type: 'number'
            })
            .argv

        const config = {}
        config.debug = args.debug
        config.name = args.name
        config.port = args.port
        config.exclude = args.exclude
        config.initialSend = args['initial-send']
        config.maxFileSize = args['max-file-size']
        config.domain = `http://${ip.address()}:${config.port}`

        if(config.name === '')
        {
            if(args._.length > 0 && typeof args._[0] === 'string' && args._[0] !== '')
            {
                config.name = args._[0]
            }
            else
            {
                config.name = 'No name'
            }
        }

        // Save
        this.config = config
    }

    /**
     * Set site
     * Instantiate site
     */
    setSite()
    {
        this.site = new Site({
            port: this.config.port,
            domain: this.config.domain,
            debug: this.config.debug
        })
    }

    /**
     * Set watcher
     * Instantiate watcher
     */
    setWatcher()
    {
        this.watcher = new Watcher({
            port: this.config.port,
            domain: this.config.domain,
            debug: this.config.debug,
            maxFileSize: this.config.maxFileSize,
            exclude: this.config.exclude,
            name: this.config.name
        })
    }
}

module.exports = App
