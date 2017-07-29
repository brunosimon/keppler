'use strict'

// Dependencies
const express = require('express')
const helmet = require('helmet')
const http = require('http')
const colors = require('colors')
const util = require('util')
const path = require('path')
const fs = require('fs')

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
                    console.log('site'.green.bold + ' - ' + 'already running'.cyan)
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
                    console.log('site'.green.bold + ' - ' + 'unknow error'.cyan)
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
                console.log('site'.green.bold + ' - ' + 'started'.cyan)
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
    createProject(_slug, _path)
    {
        this.express.get('/' + _slug, (request, response) =>
        {
            response.send('<a href="/' + _slug + '/files/empty.txt" download>download</a>')
        })

        this.express.use('/' + _slug + '/files', express.static(_path))
    }
}

module.exports = Site
