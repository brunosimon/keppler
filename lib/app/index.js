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
        console.log()
        console.log('---'.rainbow + 'keppler'.bold.white + '----------------------'.rainbow)
        console.log()

        this.setConfig()
        this.setSite(
            () =>
            {
                this.setSocket()
                this.setProjects()
            },
            () =>
            {
                console.log('app'.green.bold + ' - ' + 'keppler seems to be running already'.cyan)
            },
            () =>
            {
                console.log('error'.red)
            }
        )

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
                describe: 'Debug level',
                default: 1,
                type: 'number'
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
    setSite(_success, _error)
    {
        this.site = new Site(this.config, _success, _error)
    }

    /**
     * Set socket
     * Instantiate socket with socket io and associate it with the express server
     * /app socket is used to communicate between watchers and app (because multiple watchers can co-exist)
     */
    setSocket()
    {
        this.config.socket = socketIo.listen(this.site.server)

        // Create a socket for the watcher
        const watcherSocket = this.config.socket.of('/watcher')

        watcherSocket.on('connection', (socket) =>
        {
            // Set up
            let project = null

            // Debug
            if(this.config.debug >= 1)
            {
                console.log('app > socket'.green.bold + ' - ' + 'connect'.cyan + ' - ' + socket.id.cyan)
            }

            // Start project
            socket.on('start_project', (data) =>
            {
                project = this.projects.createProject(data.name)

                this.site.createProject(project.slug, data.path)

                // Debug
                if(this.config.debug >= 1)
                {
                    console.log('app > socket'.green.bold + ' - ' + 'start_project'.cyan + ' - ' + project.slug.cyan)
                }
                if(this.config.debug >= 2)
                {
                    console.log(util.inspect(project.files.describe(), { depth: null, colors: true }))
                }

                // Open in browser
                const url = this.config.domain + '/' + project.slug
                opener(url)
                console.log('app'.green.bold + ' - ' + url.yellow)

            })

            // Update file
            socket.on('update_file', (data) =>
            {
                project.files.createVersion(data.path, data.content)

                // Debug
                if(this.config.debug >= 1)
                {
                    console.log('app > socket'.green.bold + ' - ' + 'update_file'.cyan + ' - ' + data.path.cyan)
                }
                if(this.config.debug >= 2)
                {
                    console.log(util.inspect(project.files.describe(), { depth: null, colors: true }))
                }
            })

            // Create file
            socket.on('create_file', (data) =>
            {
                project.files.create(data.path, data.content)

                // Debug
                if(this.config.debug >= 1)
                {
                    console.log('app > socket'.green.bold + ' - ' + 'update_file'.cyan + ' - ' + data.path.cyan)
                }
                if(this.config.debug >= 2)
                {
                    console.log(util.inspect(project.files.describe(), { depth: null, colors: true }))
                }
            })

            // Delete file
            socket.on('delete_file', (data) =>
            {
                project.files.delete(data.path)

                // Debug
                if(this.config.debug >= 1)
                {
                    console.log('app > socket'.green.bold + ' - ' + 'update_file'.cyan + ' - ' + data.path.cyan)
                }
                if(this.config.debug >= 2)
                {
                    console.log(util.inspect(project.files.describe(), { depth: null, colors: true }))
                }
            })

            // Disconnect
            socket.on('disconnect', () =>
            {
                this.projects.deleteProject(project.slug)

                // Debug
                if(this.config.debug >= 1)
                {
                    console.log('app > socket'.green.bold + ' - ' + 'disconnect'.cyan + ' - ' + socket.id.cyan)
                }
            })
        })
    }

    /**
     * Set projects
     */
    setProjects()
    {
        this.projects = new Projects(this.config)
    }

    /**
     * Set watcher
     * Instantiate watcher
     */
    setWatcher()
    {
        this.watcher = new Watcher(this.config)
    }
}

module.exports = App
