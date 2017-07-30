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
const fs = require('fs')
const path = require('path')
const packageJson = require('../../package.json')

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
        console.log('---'.rainbow + ' keppler '.bold.white + packageJson.version.bold.white + ' ----------------------'.rainbow)
        console.log()

        this.setConfig()
        this.setSite(
            () =>
            {
                this.setSocket()
                this.setProjects()
                this.setTest()
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
                    '.git'
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
            .argv

        config.debug = args.debug
        config.name = args.name
        config.port = args.port
        config.exclude = args.exclude
        config.open = args.open
        config.test = args.test
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

        // Debug
        if(this.config.debug >= 1)
        {
            for(const _configKey in this.config)
            {
                const _configValue = '' + this.config[_configKey]
                console.log('app > config'.green.bold + ' - ' + _configKey.cyan + ' - ' + _configValue.cyan)
            }
        }
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
                console.log('app'.green.bold + ' - ' + url.yellow)

                if(this.config.open)
                {
                    opener(url)
                }
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

    /**
     * Set Test
     */
    setTest()
    {
        if(!this.config.test)
        {
            return
        }

        console.log('app'.green.bold + ' - ' + 'start test folder'.cyan)

        // Default project
        const project = this.projects.createProject('Test project')
        this.site.createProject(project.slug, path.join(__dirname, '../test/demo-folder/'))

        // // Same name projects
        // let project_2 = this.projects.createProject('dummy')
        // let project_3 = this.projects.createProject('dummy')
        // let project_4 = this.projects.createProject('dummy')
        // let project_5 = this.projects.createProject('dummy')

        // Some file
        // project.files.createVersion('./folder-test/test-4.css', fs.readFileSync('../test/demo-folder/folder-1/test-4.css', 'utf8'))
        // project.files.createVersion('./folder-test/depth-test/test-3.js', fs.readFileSync('../test/demo-folder/folder-2/test-3.js', 'utf8'))
        // project.files.createVersion('./folder-test/depth-test/test-3.js', fs.readFileSync('../test/demo-folder/folder-2/test-3-diff-1.js', 'utf8'))
        // project.files.createVersion('./folder-test/depth-test/test-3.js', fs.readFileSync('../test/demo-folder/folder-2/test-3-diff-2.js', 'utf8'))
        // project.files.createVersion('./folder-test/depth-test/test-3.js', fs.readFileSync('../test/demo-folder/folder-2/test-3-diff-3.js', 'utf8'))
        // project.files.createVersion('./folder-test/depth-test/test-3.js', fs.readFileSync('../test/demo-folder/folder-2/test-3-diff-4.js', 'utf8'))
        // project.files.createVersion('./folder-test/test-1.html', fs.readFileSync('../test/demo-folder/test-1.html', 'utf8'))
        // project.files.createVersion('./folder-test/test-2.php', fs.readFileSync('../test/demo-folder/test-2.php', 'utf8'))
        // project.files.createVersion('./folder-test/big-one.txt', 'line\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline')
        // project.files.createVersion('./folder-test/loooooooooooooooooooooooooooooooong-one.txt', 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz')

        project.files.createVersion('./icons/test.js', 'Test icon')
        project.files.createVersion('./icons/test.html', 'Test icon')
        project.files.createVersion('./icons/test.sass', 'Test icon')
        project.files.createVersion('./icons/test.scss', 'Test icon')
        project.files.createVersion('./icons/test.less', 'Test icon')
        project.files.createVersion('./icons/test.stylus', 'Test icon')
        project.files.createVersion('./icons/test.styl', 'Test icon')
        project.files.createVersion('./icons/test.css', 'Test icon')
        project.files.createVersion('./icons/test.php', 'Test icon')
        project.files.createVersion('./icons/test.json', 'Test icon')
        project.files.createVersion('./icons/test.jade', 'Test icon')
        project.files.createVersion('./icons/test.pug', 'Test icon')
        project.files.createVersion('./icons/test.md', 'Test icon')
        project.files.createVersion('./icons/test.sql', 'Test icon')
        project.files.createVersion('./icons/test.htaccess', 'Test icon')
        project.files.createVersion('./icons/test.htpasswd', 'Test icon')
        project.files.createVersion('./icons/test.yml', 'Test icon')
        project.files.createVersion('./icons/test.svg', 'Test icon')
        project.files.createVersion('./icons/test.eot', 'Test icon')
        project.files.createVersion('./icons/test.ttf', 'Test icon')
        project.files.createVersion('./icons/test.woff', 'Test icon')
        project.files.createVersion('./icons/test.woff2', 'Test icon')
        project.files.createVersion('./icons/test.jpeg', 'Test icon')
        project.files.createVersion('./icons/test.jpg', 'Test icon')
        project.files.createVersion('./icons/test.tiff', 'Test icon')
        project.files.createVersion('./icons/test.gif', 'Test icon')
        project.files.createVersion('./icons/test.bmp', 'Test icon')
        project.files.createVersion('./icons/test.png', 'Test icon')
        project.files.createVersion('./icons/test.webp', 'Test icon')
        project.files.createVersion('./icons/test.mpeg', 'Test icon')
        project.files.createVersion('./icons/test.mpg', 'Test icon')
        project.files.createVersion('./icons/test.mp4', 'Test icon')
        project.files.createVersion('./icons/test.amv', 'Test icon')
        project.files.createVersion('./icons/test.wmv', 'Test icon')
        project.files.createVersion('./icons/test.mov', 'Test icon')
        project.files.createVersion('./icons/test.avi', 'Test icon')
        project.files.createVersion('./icons/test.ogv', 'Test icon')
        project.files.createVersion('./icons/test.mkv', 'Test icon')
        project.files.createVersion('./icons/test.webm', 'Test icon')
        project.files.createVersion('./icons/test.mp3', 'Test icon')
        project.files.createVersion('./icons/test.wav', 'Test icon')
        project.files.createVersion('./icons/test.ogg', 'Test icon')
        project.files.createVersion('./icons/test.raw', 'Test icon')
        project.files.createVersion('./icons/test.zip', 'Test icon')
        project.files.createVersion('./icons/test.rar', 'Test icon')
        project.files.createVersion('./icons/test.7z', 'Test icon')
        project.files.createVersion('./icons/test.gz', 'Test icon')
        project.files.createVersion('./icons/test.txt', 'Test icon')
        project.files.createVersion('./icons/test.coffee', 'Test icon')
        project.files.createVersion('./icons/test.gitignore', 'Test icon')
        project.files.createVersion('./icons/test.gitkeep', 'Test icon')
        project.files.createVersion('./icons/test.xml', 'Test icon')
        project.files.createVersion('./icons/test.twig', 'Test icon')
        project.files.createVersion('./icons/test.c', 'Test icon')
        project.files.createVersion('./icons/test.h', 'Test icon')
        project.files.createVersion('./icons/test.pwet', 'Test icon')

        // project.files.createVersion('./toto/tata/lorem.txt', '123456789')
        // project.files.createVersion('./toto/tata/lorem.txt', '1aze')
        // project.files.createVersion('./toto/tata/ipsum.txt', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia asperiores iure, animi voluptatibus ut officiis. Molestias, quod perferendis hic totam doloremque, porro aperiam enim tenetur, maxime inventore consequuntur nisi in?')

        // Adding file versions
        let counting = 0
        setInterval(function()
        {
            project.files.createVersion('./folder-test/multi-version.txt', 'test: ' + counting++)
        }, 2000)

        // Creating and deleting file
        let toggle = true
        setInterval(function()
        {
            if(toggle)
                project.files.create('./folder-test/toggle.txt', 'content')
            else
                project.files.delete('./folder-test/toggle.txt', 'content')

            toggle = !toggle
        }, 3000)
    }

}

module.exports = App
