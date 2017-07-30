'use strict'

const ids = require('./ids.js')
const robotNames = require('./robot-names.json')

class Chat
{
    constructor(_config, _options)
    {
        this.config = _config
        this.slug = _options.slug
        this.users = {}
        this.messages = []
        this.availableRobotNames = this.shuffle(robotNames.slice())

        this.setSocket()
    }

    setSocket()
    {
        // Create a channel for this specific chjat
        this.chatSocket = this.config.socket.of('/project/' + this.slug + '/chat')

        // Connection event
        this.chatSocket.on('connection', (socket) =>
        {
            // Create user
            const user = this.createUser()

            // Debug
            if(this.config.debug >= 1)
            {
                console.log('chat > socket'.green.bold + ' - ' + 'connection'.cyan + ' - ' + socket.id.cyan)
                console.log('chat > user'.green.bold + ' - ' + 'create'.cyan + ' - ' + user.name.cyan)
            }

            // Send infos
            const broadcastUser = {}
            broadcastUser.name = user.name
            broadcastUser.color = user.color
            socket.emit('infos', broadcastUser)

            // On message
            socket.on('message', (data) =>
            {
                // Add ID and save
                data.id = ids.getId()
                data.time = new Date()
                this.messages.push(data)

                // Create a broadcast message, add complementary data and send
                const broadcastMessage = {}
                broadcastMessage.id = data.id
                broadcastMessage.time = data.time
                broadcastMessage.text = data.text
                broadcastMessage.file = data.file
                broadcastMessage.line = data.line
                broadcastMessage.user = user

                this.chatSocket.emit('message', broadcastMessage)

                // Debug
                if(this.config.debug >= 1)
                {
                    console.log('chat > socket'.green.bold + ' - ' + 'message'.cyan + ' - ' + user.name.cyan + ' - ' + data.text.cyan)
                }
            })

            // On update infos
            socket.on('update_infos', (data) =>
            {
                const newName = data.name.trim()
                const oldName = user.name

                // Securities
                if(newName.length <= 0 || newName.length > 22 || newName === oldName)
                {
                    return
                }

                // Update name
                user.name = data.name

                // Debug
                if(this.config.debug >= 1)
                {
                    console.log('chat > socket'.green.bold + ' - ' + 'update_infos'.cyan + ' - ' + (oldName + ' > ' + user.name).cyan)
                }
            })

            // On disconnect
            socket.on('disconnect', () =>
            {
                console.log('chat > socket'.green.bold + ' - ' + 'disconnect'.cyan + ' - ' + user.name.cyan)
            })
        })
    }

    createUser()
    {
        const user = {}
        user.name = this.getRandomName()
        user.color = this.getRandomColor()
        user.id = ids.getId()

        this.users[user.id] = user

        return user
    }

    shuffle(a)
    {
        let j = null
        let x = null
        let i = null

        for(i = a.length; i; i--)
        {
            j = Math.floor(Math.random() * i)
            x = a[i - 1]
            a[i - 1] = a[j]
            a[j] = x
        }

        return a
    }

    getRandomColor()
    {
        const r = (Math.round(Math.random() * 127) + 127).toString(16)
        const g = (Math.round(Math.random() * 127) + 127).toString(16)
        const b = (Math.round(Math.random() * 127) + 127).toString(16)
        const color = '#' + r + g + b

        return color
    }

    getRandomName()
    {
        // Refill robot names if no more name available
        if(this.availableRobotNames.length === 0)
        {
            this.availableRobotNames = this.shuffle(robotNames.slice())
        }

        const robotName = this.availableRobotNames.pop()

        return robotName
    }
}

module.exports = Chat
