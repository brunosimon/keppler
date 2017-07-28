'use strict'

// Depedencies
const ip = require('ip')
const Site = require('./site.js')
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
        this.setSite()
        this.setSocket()
        this.setProjects()
        this.setWatcher()
    }

    /**
     * Set config
     */
    setConfig()
    {
        const config = {}

        // From arguments
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

        config.debug = args.debug
        config.name = args.name
        config.port = args.port
        config.exclude = args.exclude
        config.initialSend = args['initial-send']
        config.maxFileSize = args['max-file-size']

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

        // Custom
        config.domain = `http://${ip.address()}${config.port !== 80 ? ':' + config.port : ''}`

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
     * Set socket
     * Instantiate socket with socket io and associate it with the express server
     * /app socket is used to communicate between watchers and app (because multiple watchers can co-exist)
     */
    setSocket()
    {
        this.sockets = {}
        this.sockets.main = socketIo.listen(this.site.server)
        this.sockets.app = this.sockets.main.of('/app')

        console.log('ok')

        this.sockets.app.on('connection', (socket) =>
        {
            // Set up
            let project = null

            // Debug
            if(this.config.debug)
            {
                console.log('socket app'.green.bold + ' - ' + 'connect'.cyan + ' - ' + socket.id.cyan)
            }

            // Start project
            socket.on('start_project', (data) =>
            {
                project = this.projects.createProject(data.name)

                this.site.createProject(project.slug, data.path)

                // Open in browser
                const url = this.config.domain + '/' + project.slug
                opener(url)
                console.log('app'.green.bold + ' - ' + url)

                // Debug
                if(this.config.debug)
                {
                    console.log(util.inspect(project.files.describe(), { depth: null, colors: true }))
                }
            })

            // Update file
            socket.on('update_file', (data) =>
            {
                console.log(data)
                project.files.createVersion(data.path, data.content)

                // Debug
                if(this.config.debug)
                {
                    console.log(util.inspect(project.files.describe(), { depth: null, colors: true }))
                }
            })

            // Create file
            socket.on('create_file', (data) =>
            {
                project.files.create(data.path, data.content)

                // Debug
                if(this.config.debug)
                {
                    console.log(util.inspect(project.files.describe(), { depth: null, colors: true }))
                }
            })

            // Delete file
            socket.on('delete_file', (data) =>
            {
                project.files.delete(data.path)

                // Debug
                if(this.config.debug)
                {
                    console.log(util.inspect(project.files.describe(), { depth: null, colors: true }))
                }
            })

            // Disconnect
            socket.on('disconnect', () =>
            {
                this.projects.deleteProject(project.slug)

                // Debug
                if(this.config.debug)
                {
                    console.log('socket app'.green.bold + ' - ' + 'disconnect'.cyan + ' - ' + socket.id.cyan)
                }
            })
        })
    }

    /**
     * Set watcher
     * Instantiate watcher
     */
    setWatcher()
    {
        this.watcher = new Watcher(this.config)
    }

    /**
     * Set projects
     */
    setProjects()
    {
        this.projects = new Projects({ socket: this.sockets.main, debug: this.config.debug })
    }
}

module.exports = App
