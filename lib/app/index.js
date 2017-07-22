'use strict'

// Depedencies
const ip = require('ip')
const Site = require('./site')
const Watcher = require('./watcher.js')
const Projects = require('./projects.js')
const socketIo = require('socket.io')
const util = require('util')
const colors = require('colors')
const opener = require('opener')

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

        this.socket = socketIo.listen()
        
        this.projects = new Projects({ socket: this.socket, debug: this.config.debug })
        this.project = this.projects.createProject(this.config.name)
        
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
        this.site = new Site(this.config)
    }

    /**
     * Set watcher
     * Instantiate watcher
     */
    setWatcher()
    {
        this.watcher = new Watcher(this.config)

        const url = this.config.domain + '/project/' + this.project.slug

        console.log('server'.green.bold + ' - ' + url.cyan)

        // Open in browser
        opener(url)

        // Debug
        if(this.config.debug)
        {
            console.log(util.inspect(this.project.files.describe(), { depth: null, colors: true }))
        }

        // Update file
        this.watcher.on('update_file', (data) =>
        {
            console.log(data)
            this.project.files.createVersion(data.path, data.content)

            // Debug
            if(this.config.debug)
            {
                console.log(util.inspect(this.project.files.describe(), { depth: null, colors: true }))
            }
        })

        // Create file
        this.watcher.on('create_file', (data) =>
        {
            this.project.files.create(data.path, data.content)

            // Debug
            if(this.config.debug)
            {
                console.log(util.inspect(this.project.files.describe(), { depth: null, colors: true }))
            }
        })

        // Delete file
        this.watcher.on('delete_file', (data) =>
        {
            this.project.files.delete(data.path)

            // Debug
            if(this.config.debug)
            {
                console.log(util.inspect(this.project.files.describe(), { depth: null, colors: true }))
            }
        })

        // // Disconnect
        // this.watcher.on('disconnect', () =>
        // {
        //     this.projects.delete_project(this.project.slug)

        //     // Debug
        //     if(this.config.debug)
        //     {
        //         console.log('socket app'.green.bold + ' - ' + 'disconnect'.cyan + ' - ' + socket.id.cyan)
        //     }
        // })
    }
}

module.exports = App
