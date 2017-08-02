'use strict'

// Dependencies
const express = require('express')
const helmet = require('helmet')
const http = require('http')
const colors = require('colors')
const path = require('path')

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
    }

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
    createProjectRoute(_project)
    {
        this.express.use('/', express.static(path.join(__dirname, '../site-webpack/dist')))

        // Project route
        this.express.get('/' + _project.slug, (request, response) =>
        {
            response.send(`
                <a href="/${_project.slug}/download" download>download project</a>
                <a href="/${_project.slug}/files/empty.txt" download>download file</a>
                
                <form action="#" class="infos-form">
                    <input type="text" class="name" value="" /> Name
                    <input type="submit" value="send" />
                </form>

                <form action="#" class="message-form">
                    <input type="text" class="text" value="Lorem ipsum" /> Text
                    <input type="number" class="file" value="1" /> File
                    <input type="line" class="line" value="2" /> Line
                    <input type="submit" value="send" />
                </form>

                <div class="messages"></div>

                <script src="/socket.io/socket.io.js"></script>
                <script>
                    const socket = io('${this.config.domain}/project/${_project.slug}/chat')

                    socket.on('connect', () =>
                    {
                        console.log('connected')
                    })

                    // Infos
                    const $infosForm = document.querySelector('.infos-form')
                    const $name = $infosForm.querySelector('.name')

                    $infosForm.addEventListener('submit', (event) =>
                    {
                        event.preventDefault()

                        const name = $name.value

                        socket.emit('update_infos', { name })
                    })

                    socket.on('infos', (data) =>
                    {
                        console.log('infos')
                        console.log(data)
                        $name.value = data.name
                    })

                    // Messages
                    const $messages = document.querySelector('.messages')
                    const $messageForm = document.querySelector('.message-form')
                    const $text = $messageForm.querySelector('.text')
                    const $file = $messageForm.querySelector('.file')
                    const $line = $messageForm.querySelector('.line')

                    $messageForm.addEventListener('submit', (event) =>
                    {
                        event.preventDefault()

                        const text = $text.value
                        const file = $file.value
                        const line = $line.value

                        socket.emit('message', { text, file, line })
                    })

                    socket.on('message', (data) =>
                    {
                        console.log('message')
                        console.log(data)

                        $message = document.createElement('div')

                        const $author = document.createElement('div')
                        $author.style.color = data.user.color
                        $author.innerHTML = data.user.name
                        $message.appendChild($author)

                        const $info = document.createElement('div')
                        $info.innerHTML = data.file + ':' + data.line
                        $message.appendChild($info)

                        const $text = document.createElement('div')
                        $text.innerHTML = data.text
                        $message.appendChild($text)

                        $messages.appendChild($message)
                    })
                </script>
            `)
        })

        // Project download route
        this.express.get('/' + _project.slug + '/download', (request, response) =>
        {
            // Get zip buffer
            const zipBuffer = _project.getZipBuffer()

            // Send
            response.writeHead(200, {
                'Content-Type': 'application/zip',
                'Content-Length': zipBuffer.length
            })
            response.write(zipBuffer, 'binary')
            response.end(null, 'binary')
        })

        this.express.use('/' + _project.slug + '/files', express.static(_project.path))
    }
}

module.exports = Site
