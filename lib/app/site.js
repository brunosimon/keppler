'use strict'

// Dependencies
const express = require('express')
const helmet = require('helmet')
const http = require('http')
const colors = require('colors')
const util = require('util')
const path = require('path')
const Projects = require('./projects.js')
const fs = require('fs')
const opener = require('opener')

/**
 * Site class
 */
class Site
{
    /**
     * Constructor
     */
    constructor(_config)
    {
        this.config = _config

        this.setExpress()
        this.setServer()
        // this.setSocket()
        // this.setModels()
        // this.setDummy()
    }

    // /**
    //  * Set Dummy
    //  */
    // setDummy()
    // {
    //     if(!this.config.debug)
    //     {
    //         return
    //     }

    //     // Default project
    //     const project = this.projects.createProject('Dummy project')

    //     // // Same name projects
    //     // let project_2 = this.projects.createProject('dummy')
    //     // let project_3 = this.projects.createProject('dummy')
    //     // let project_4 = this.projects.createProject('dummy')
    //     // let project_5 = this.projects.createProject('dummy')

    //     // Some file
    //     project.files.createVersion('./folder-test/test-4.css', fs.readFileSync('../test-folder/folder-1/test-4.css', 'utf8'))
    //     project.files.createVersion('./folder-test/depth-test/test-3.js', fs.readFileSync('../test-folder/folder-2/test-3.js', 'utf8'))
    //     project.files.createVersion('./folder-test/depth-test/test-3.js', fs.readFileSync('../test-folder/folder-2/test-3-diff-1.js', 'utf8'))
    //     project.files.createVersion('./folder-test/depth-test/test-3.js', fs.readFileSync('../test-folder/folder-2/test-3-diff-2.js', 'utf8'))
    //     project.files.createVersion('./folder-test/depth-test/test-3.js', fs.readFileSync('../test-folder/folder-2/test-3-diff-3.js', 'utf8'))
    //     project.files.createVersion('./folder-test/depth-test/test-3.js', fs.readFileSync('../test-folder/folder-2/test-3-diff-4.js', 'utf8'))
    //     project.files.createVersion('./folder-test/test-1.html', fs.readFileSync('../test-folder/test-1.html', 'utf8'))
    //     project.files.createVersion('./folder-test/test-2.php', fs.readFileSync('../test-folder/test-2.php', 'utf8'))
    //     project.files.createVersion('./folder-test/big-one.txt', 'line\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline\nline')
    //     project.files.createVersion('./folder-test/loooooooooooooooooooooooooooooooong-one.txt', 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz')

    //     project.files.createVersion('./icons/test.js', 'Test icon')
    //     project.files.createVersion('./icons/test.html', 'Test icon')
    //     project.files.createVersion('./icons/test.sass', 'Test icon')
    //     project.files.createVersion('./icons/test.scss', 'Test icon')
    //     project.files.createVersion('./icons/test.less', 'Test icon')
    //     project.files.createVersion('./icons/test.stylus', 'Test icon')
    //     project.files.createVersion('./icons/test.styl', 'Test icon')
    //     project.files.createVersion('./icons/test.css', 'Test icon')
    //     project.files.createVersion('./icons/test.php', 'Test icon')
    //     project.files.createVersion('./icons/test.json', 'Test icon')
    //     project.files.createVersion('./icons/test.jade', 'Test icon')
    //     project.files.createVersion('./icons/test.pug', 'Test icon')
    //     project.files.createVersion('./icons/test.md', 'Test icon')
    //     project.files.createVersion('./icons/test.sql', 'Test icon')
    //     project.files.createVersion('./icons/test.htaccess', 'Test icon')
    //     project.files.createVersion('./icons/test.htpasswd', 'Test icon')
    //     project.files.createVersion('./icons/test.yml', 'Test icon')
    //     project.files.createVersion('./icons/test.svg', 'Test icon')
    //     project.files.createVersion('./icons/test.eot', 'Test icon')
    //     project.files.createVersion('./icons/test.ttf', 'Test icon')
    //     project.files.createVersion('./icons/test.woff', 'Test icon')
    //     project.files.createVersion('./icons/test.woff2', 'Test icon')
    //     project.files.createVersion('./icons/test.jpeg', 'Test icon')
    //     project.files.createVersion('./icons/test.jpg', 'Test icon')
    //     project.files.createVersion('./icons/test.tiff', 'Test icon')
    //     project.files.createVersion('./icons/test.gif', 'Test icon')
    //     project.files.createVersion('./icons/test.bmp', 'Test icon')
    //     project.files.createVersion('./icons/test.png', 'Test icon')
    //     project.files.createVersion('./icons/test.webp', 'Test icon')
    //     project.files.createVersion('./icons/test.mpeg', 'Test icon')
    //     project.files.createVersion('./icons/test.mpg', 'Test icon')
    //     project.files.createVersion('./icons/test.mp4', 'Test icon')
    //     project.files.createVersion('./icons/test.amv', 'Test icon')
    //     project.files.createVersion('./icons/test.wmv', 'Test icon')
    //     project.files.createVersion('./icons/test.mov', 'Test icon')
    //     project.files.createVersion('./icons/test.avi', 'Test icon')
    //     project.files.createVersion('./icons/test.ogv', 'Test icon')
    //     project.files.createVersion('./icons/test.mkv', 'Test icon')
    //     project.files.createVersion('./icons/test.webm', 'Test icon')
    //     project.files.createVersion('./icons/test.mp3', 'Test icon')
    //     project.files.createVersion('./icons/test.wav', 'Test icon')
    //     project.files.createVersion('./icons/test.ogg', 'Test icon')
    //     project.files.createVersion('./icons/test.raw', 'Test icon')
    //     project.files.createVersion('./icons/test.zip', 'Test icon')
    //     project.files.createVersion('./icons/test.rar', 'Test icon')
    //     project.files.createVersion('./icons/test.7z', 'Test icon')
    //     project.files.createVersion('./icons/test.gz', 'Test icon')
    //     project.files.createVersion('./icons/test.txt', 'Test icon')
    //     project.files.createVersion('./icons/test.coffee', 'Test icon')
    //     project.files.createVersion('./icons/test.gitignore', 'Test icon')
    //     project.files.createVersion('./icons/test.gitkeep', 'Test icon')
    //     project.files.createVersion('./icons/test.xml', 'Test icon')
    //     project.files.createVersion('./icons/test.twig', 'Test icon')
    //     project.files.createVersion('./icons/test.c', 'Test icon')
    //     project.files.createVersion('./icons/test.h', 'Test icon')
    //     project.files.createVersion('./icons/test.pwet', 'Test icon')

    //     // project.files.createVersion('./toto/tata/lorem.txt', '123456789')
    //     // project.files.createVersion('./toto/tata/lorem.txt', '1aze')
    //     // project.files.createVersion('./toto/tata/ipsum.txt', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia asperiores iure, animi voluptatibus ut officiis. Molestias, quod perferendis hic totam doloremque, porro aperiam enim tenetur, maxime inventore consequuntur nisi in?')

    //     // Adding file versions
    //     let counting = 0
    //     setInterval(function()
    //     {
    //         project.files.createVersion('./folder-test/multi-version.txt', 'test: ' + counting++)
    //     }, 2000)

    //     // Creating and deleting file
    //     let toggle = true
    //     setInterval(function()
    //     {
    //         if(toggle)
    //             project.files.create('./folder-test/toggle.txt', 'content')
    //         else
    //             project.files.delete('./folder-test/toggle.txt', 'content')

    //         toggle = !toggle
    //     }, 3000)

    //     // // Log
    //     // console.log(util.inspect(project.files.describe(), { depth: null, colors: true }))
    // }

    // /**
    //  * Set models
    //  */
    // setModels()
    // {
    //     // Set up
    //     this.projects = new Projects({ socket: this.sockets.main, debug: this.config.debug })
    // }

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
                // Debug
                if(this.config.debug)
                {
                    console.log('site already running'.green.bold)
                }

                return
            }

            console.log(error.message)
        })

        // Start
        this.server.listen(this.config.port, () =>
        {
            // URL
            console.log(colors.green('---------------------------'))
            console.log('site'.green.bold + ' - ' + 'started'.cyan)
        })
    }

    /**
     * Create project
     */
    createProject(_slug, _path)
    {
        this.express.get('/' + _slug, (request, response) =>
        {
            response.send('<a href="/' + _slug + '/files/empty.txt" download>download</a>')
        })

        this.express.use('/' + _slug + '/files', express.static(_path))
    }

    // /**
    //  * Set socket
    //  */
    // setSocket()
    // {
    //     // Set up
    //     this.sockets      = {}
    //     this.sockets.main = socketIo.listen(this.server)
    //     this.sockets.app  = this.sockets.main.of('/app')

    //     // App connection event
    //     this.sockets.app.on('connection', (socket) =>
    //     {
    //         // Set up
    //         let project = null

    //         // Debug
    //         if(this.config.debug)
    //         {
    //             console.log('socket app'.green.bold + ' - ' + 'connect'.cyan + ' - ' + socket.id.cyan)
    //         }

    //         // Start project
    //         socket.on('start_project', (data) =>
    //         {
    //             project = this.projects.createProject(data.name)

    //             const url = this.config.url

    //             console.log('site'.green.bold + ' - ' + url.cyan)

    //             // Open in browser
    //             opener(url)

    //             // Debug
    //             if(this.config.debug)
    //             {
    //                 console.log(util.inspect(project.files.describe(), { depth: null, colors: true }))
    //             }
    //         })

    //         // Update file
    //         socket.on('update_file', (data) =>
    //         {
    //             project.files.createVersion(data.path, data.content)

    //             // Debug
    //             if(this.config.debug)
    //             {
    //                 console.log(util.inspect(project.files.describe(), { depth: null, colors: true }))
    //             }
    //         })

    //         // Create file
    //         socket.on('create_file', (data) =>
    //         {
    //             project.files.create(data.path, data.content)

    //             // Debug
    //             if(this.config.debug)
    //             {
    //                 console.log(util.inspect(project.files.describe(), { depth: null, colors: true }))
    //             }
    //         })

    //         // Delete file
    //         socket.on('delete_file', (data) =>
    //         {
    //             project.files.delete(data.path)

    //             // Debug
    //             if(this.config.debug)
    //             {
    //                 console.log(util.inspect(project.files.describe(), { depth: null, colors: true }))
    //             }
    //         })

    //         // Disconnect
    //         socket.on('disconnect', () =>
    //         {
    //             this.projects.delete_project(project.slug)

    //             // Debug
    //             if(this.config.debug)
    //             {
    //                 console.log('socket app'.green.bold + ' - ' + 'disconnect'.cyan + ' - ' + socket.id.cyan)
    //             }
    //         })
    //     })
    // }
}

module.exports = Site
