// Dependencies
const slug = require('slug')
const Files = require('./files.js')
const Chat = require('./chat.js')
const JSZip = require('jszip')
const globby = require('globby')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')

class Project
{
    constructor(_config, _options)
    {
        this.config = _config
        this.path = _options.path
        this.watcherSocket = _options.watcherSocket
        this.exclude = _options.exclude

        this.setName(_options.name)
        this.setSocket()

        this.zipNeedsUpdate = true
        this.files = new Files(this.config, { projectSocket: this.projectSocket })
        this.chat = new Chat(this.config, { slug: this.slug, watcherSocket: this.watcherSocket })
        this.date = new Date()

        // Add test contents
        if(this.config.test)
        {
            this.addTestContents()
        }
    }

    setName(_name)
    {
        this.name = _name
        this.slug = slug(this.name, { lower: true })
    }

    setSocket()
    {
        // Create a channel for this specific project
        this.projectSocket = this.config.socket.of('/project/' + this.slug)

        // Callbacks
        this.socketCallbacks = {}
        this.socketCallbacks.connection = (socket) =>
        {
            this.projectSocket.emit('update_project', this.describe())

            // Debug
            if(this.config.debug >= 1)
            {
                console.log(`${chalk.green.bold('project > socket')} - ${chalk.cyan('connection')} - ${chalk.cyan(socket.id)}`)
            }
        }

        // Connection event
        this.projectSocket.on('connection', this.socketCallbacks.connection)
    }

    getZipBuffer()
    {
        // Already zipped and don't need update
        if(!this.zipNeedsUpdate)
        {
            // Debug
            if(this.config.debug >= 1)
            {
                console.log(`${chalk.green.bold('project > zip')} - ${chalk.cyan('from cache')}`)
            }
        }
        else
        {
            // Search files with glob
            const globPattern = ['**', ...this.exclude.map((item) => `!${item}`)]
            const files = globby.sync(globPattern, { dot: true })

            // Create a zip file
            this.zip = new JSZip()

            // Add files to zip
            for(const _file of files)
            {
                const stats = fs.lstatSync(_file)

                // Ignore if folder or exluded
                if(stats.isFile())
                {
                    const basename = path.basename(_file)
                    const relativePath = _file.replace(basename, '').replace(this.path, '')
                    this.zip.file(`${relativePath}${basename}`, fs.readFileSync(_file))
                }
            }
        }

        // Create and return zip buffer
        const zipBuffer = this.zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
        this.zipNeedsUpdate = false

        // Debug
        if(this.config.debug >= 1)
        {
            console.log(`${chalk.green.bold('project > zip')} - ${chalk.cyan('create')}`)
        }

        return zipBuffer
    }
    /**
     * Add Test contents
     */
    addTestContents()
    {
        console.log(`${chalk.green.bold('project')} - ${chalk.cyan('add test content')}`)

        // Add some with true contents
        this.files.createVersion('./test/file.css', `body {
    margin:0;
    padding:0;
}

h1, h2
{
    font-size:20px;
}

h3
{
    font-size:15px;
}

h4
{
    font-size:10px;
}

.toto .tata > span {
    background:url('kikoo.png') top left repeat-x;
}`)
        setTimeout(() =>
        {
            this.files.createVersion('./test/file.css', `body
{
    margin: 0;
}

h1
{
    font-size:20px;
}

h4
{
    font-size:10px;
}

.toto .tata > span
{
    background: url('kikoo.png') top left repeat-x;
 }`)
        }, 20)
        this.files.createVersion('./test/file.js', `'use strict'

/**
 * Test
 */
class ClassName extends AnotherClass
{
    constructor( argument )
    {
        // code...
    }

    test()
    {

    }
}`)
        this.files.createVersion('./test/file.php', `<?php

/**
* Test
*/
class ClassName extends AnotherClass
{

    function __construct( argument )
    {
        // code...
    }

    function test()
    {

    }
}`)
        this.files.createVersion('./test/file.html', `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>
<body>
    <section>
        Bonjour
        <form action="#">
            <input type="text">
        </form>
    </section>
</body>
</html>`)

        // Add some with icons
        this.files.createVersion('./test/icons/test.js', 'Test icon')
        this.files.createVersion('./test/icons/test.html', 'Test icon')
        this.files.createVersion('./test/icons/test.sass', 'Test icon')
        this.files.createVersion('./test/icons/test.scss', 'Test icon')
        this.files.createVersion('./test/icons/test.less', 'Test icon')
        this.files.createVersion('./test/icons/test.stylus', 'Test icon')
        this.files.createVersion('./test/icons/test.styl', 'Test icon')
        this.files.createVersion('./test/icons/test.css', 'Test icon')
        this.files.createVersion('./test/icons/test.php', 'Test icon')
        this.files.createVersion('./test/icons/test.json', 'Test icon')
        this.files.createVersion('./test/icons/test.jade', 'Test icon')
        this.files.createVersion('./test/icons/test.pug', 'Test icon')
        this.files.createVersion('./test/icons/test.md', 'Test icon')
        this.files.createVersion('./test/icons/test.sql', 'Test icon')
        this.files.createVersion('./test/icons/test.htaccess', 'Test icon')
        this.files.createVersion('./test/icons/test.htpasswd', 'Test icon')
        this.files.createVersion('./test/icons/test.yml', 'Test icon')
        this.files.createVersion('./test/icons/test.svg', 'Test icon')
        this.files.createVersion('./test/icons/test.eot', 'Test icon')
        this.files.createVersion('./test/icons/test.ttf', 'Test icon')
        this.files.createVersion('./test/icons/test.woff', 'Test icon')
        this.files.createVersion('./test/icons/test.woff2', 'Test icon')
        this.files.createVersion('./test/icons/test.jpeg', 'Test icon')
        this.files.createVersion('./test/icons/test.jpg', 'Test icon')
        this.files.createVersion('./test/icons/test.tiff', 'Test icon')
        this.files.createVersion('./test/icons/test.gif', 'Test icon')
        this.files.createVersion('./test/icons/test.bmp', 'Test icon')
        this.files.createVersion('./test/icons/test.png', 'Test icon')
        this.files.createVersion('./test/icons/test.webp', 'Test icon')
        this.files.createVersion('./test/icons/test.mpeg', 'Test icon')
        this.files.createVersion('./test/icons/test.mpg', 'Test icon')
        this.files.createVersion('./test/icons/test.mp4', 'Test icon')
        this.files.createVersion('./test/icons/test.amv', 'Test icon')
        this.files.createVersion('./test/icons/test.wmv', 'Test icon')
        this.files.createVersion('./test/icons/test.mov', 'Test icon')
        this.files.createVersion('./test/icons/test.avi', 'Test icon')
        this.files.createVersion('./test/icons/test.ogv', 'Test icon')
        this.files.createVersion('./test/icons/test.mkv', 'Test icon')
        this.files.createVersion('./test/icons/test.webm', 'Test icon')
        this.files.createVersion('./test/icons/test.mp3', 'Test icon')
        this.files.createVersion('./test/icons/test.wav', 'Test icon')
        this.files.createVersion('./test/icons/test.ogg', 'Test icon')
        this.files.createVersion('./test/icons/test.raw', 'Test icon')
        this.files.createVersion('./test/icons/test.zip', 'Test icon')
        this.files.createVersion('./test/icons/test.rar', 'Test icon')
        this.files.createVersion('./test/icons/test.7z', 'Test icon')
        this.files.createVersion('./test/icons/test.gz', 'Test icon')
        this.files.createVersion('./test/icons/test.txt', 'Test icon')
        this.files.createVersion('./test/icons/test.coffee', 'Test icon')
        this.files.createVersion('./test/icons/test.gitignore', 'Test icon')
        this.files.createVersion('./test/icons/test.gitkeep', 'Test icon')
        this.files.createVersion('./test/icons/test.xml', 'Test icon')
        this.files.createVersion('./test/icons/test.twig', 'Test icon')
        this.files.createVersion('./test/icons/test.c', 'Test icon')
        this.files.createVersion('./test/icons/test.h', 'Test icon')
        this.files.createVersion('./test/icons/test.pwet', 'Test icon')
        this.files.createVersion('./test/icons/test.go', 'Test icon')
        this.files.createVersion('./test/icons/test.kt', 'Test icon')
        this.files.createVersion('./test/and that\'s a very long file with a very long name so I can test how scrolling works', 'Test icon')

        // Adding file versions
        let counting = 0
        setInterval(() =>
        {
            this.files.createVersion('./test/versions.txt', 'test: ' + counting++)
        }, 2000)

        // Creating and deleting file
        let toggle = true
        setInterval(() =>
        {
            if(toggle)
            {
                this.files.create('./test/toggle.txt', 'content')
            }
            else
            {
                this.files.delete('./test/toggle.txt', 'content')
            }

            toggle = !toggle
        }, 3000)
    }

    describe()
    {
        // Set up
        const result = {}

        result.name  = this.name
        result.files = this.files.describe()
        result.date  = this.date

        return result
    }

    destructor()
    {
        // Destroy chat and files
        this.files.destructor()
        this.chat.destructor()

        // Stop listening
        this.projectSocket.off('connection', this.socketCallbacks.connection)

        // Emit event
        this.projectSocket.emit('destruct')
    }
}

module.exports = Project
