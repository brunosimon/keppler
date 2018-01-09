// Depedencies
const ip = require('ip')
const Site = require('./site.js')
const Watcher = require('./watcher.js')
const Projects = require('./projects.js')
const socketIo = require('socket.io')
const util = require('util')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const gradientString = require('gradient-string')
const packageJson = require('../package.json')

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
        console.log(`${gradientString.pastel('----------------------')} ${chalk.white.bold('keppler')} ${chalk.white.bold(packageJson.version)} ${gradientString.pastel('----------------------')}`)
        console.log()

        this.setConfig()

        // If host is not specified
        // Start the server
        if(!this.config.host)
        {
            this.setServer()
        }

        // If not started as a server
        // Start watching files
        if(!this.config.server)
        {
            this.setWatcher()
        }
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
                describe: 'Server port',
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
                    '.git',
                    '.vscode',
                    '.env',
                    '.log',
                    '.idea/**',
                    '*___jb_old___',
                    '*___jb_tmp___'
                ],
                type: 'array'
            })
            .option('open', {
                alias: 'o',
                describe: 'Open in default browser',
                default: true,
                type: 'boolean'
            })
            .option('test', {
                alias: 't',
                describe: 'Start a test project',
                default: false,
                type: 'boolean'
            })
            .option('initial-send', {
                alias: 'i',
                describe: 'Send files in folder at start',
                default: false,
                type: 'boolean'
            })
            .option('max-file-size', {
                alias: 'm',
                describe: 'Maximum file size in octets',
                default: 99999,
                type: 'number'
            })
            .option('server', {
                alias: 's',
                describe: 'Start keppler has server',
                default: false,
                type: 'boolean'
            })
            .option('host', {
                alias: 'h',
                describe: 'Host, in case it\'s not a local',
                default: '',
                type: 'string'
            })
            .argv

        config.debug = args.debug
        config.name = args.name
        config.port = args.port
        config.exclude = args.exclude
        config.open = args.open
        config.test = args.test
        config.initialSend = args['initial-send']
        config.maxFileSize = args['max-file-size']
        config.server = args.server
        config.host = args.host

        if(config.name === '')
        {
            if(args._.length > 0 && typeof args._[0] === 'string' && args._[0] !== '')
            {
                config.name = args._[0]
            }
        }

        if(config.host === '')
        {
            config.host = false
        }

        // Custom
        config.domain = `http://${config.host ? config.host : ip.address()}${config.port !== 80 ? ':' + config.port : ''}`

        // Save
        this.config = config

        // Debug
        if(this.config.debug >= 1)
        {
            for(const _configKey in this.config)
            {
                const _configValue = '' + this.config[_configKey]
                console.log(`${chalk.green.bold('app > config')} - ${chalk.cyan(_configKey)} - ${chalk.cyan(_configValue)}`)
            }
        }
    }

    /**
     * Set server
     * Insitantiate the site and when the site is ready, instantiate the socket connexion and projects
     */
    setServer()
    {
        this.setSite(
            () =>
            {
                this.setSocket()
                this.setProjects()
            },
            () =>
            {
                console.log(chalk.red('error'))
                console.log(`${chalk.green.bold('app')} - ${chalk.cyan('keppler seems to be running already')}`)
            }
        )
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
                console.log(`${chalk.green.bold('app > socket')} - ${chalk.cyan('connect')} - ${chalk.cyan(socket.id)}`)
            }

            // Start project
            socket.on('start_project', (data) =>
            {
                data.watcherSocket = socket // Add watcher socket
                project = this.projects.createProject(data)

                this.site.createProjectRoute(project)

                // Debug
                if(this.config.debug >= 1)
                {
                    console.log(`${chalk.green.bold('app > socket')} - ${chalk.cyan('start_project')} - ${chalk.cyan(project.slug)}`)
                }
                if(this.config.debug >= 2)
                {
                    console.log(util.inspect(project.files.describe(), { depth: null, colors: true }))
                }

                socket.emit('started')
            })

            // Update file
            socket.on('update_file', (data) =>
            {
                project.files.createVersion(data.path, data.content)
                project.zipNeedsUpdate = true

                // Debug
                if(this.config.debug >= 1)
                {
                    console.log(`${chalk.green.bold('app > socket')} - ${chalk.cyan('update_file')} - ${chalk.cyan(data.path)}`)
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
                project.zipNeedsUpdate = true

                // Debug
                if(this.config.debug >= 1)
                {
                    console.log(`${chalk.green.bold('app > socket')} - ${chalk.cyan('create_file')} - ${chalk.cyan(data.path)}`)
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
                project.zipNeedsUpdate = true

                // Debug
                if(this.config.debug >= 1)
                {
                    console.log(`${chalk.green.bold('app > socket')} - ${chalk.cyan('delete_file')} - ${chalk.cyan(data.path)}`)
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
                    console.log(`${chalk.green.bold('app > socket')} - ${chalk.cyan('disconnect')} - ${chalk.cyan(socket.id)}`)
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
