const ids = require('./ids.js')
const robotNames = require('./assets/data/robot-names.json')
const chalk = require('chalk')
const HTMLEntities = require('html-entities')

class Chat
{
    constructor(_config, _options)
    {
        this.config = _config
        this.slug = _options.slug
        this.watcherSocket = _options.watcherSocket

        this.users = {}
        this.messages = []
        this.availableRobotNames = this.shuffle(robotNames.slice())
        this.htmlEntities = new HTMLEntities.XmlEntities()

        this.setSocket()

        // Add test contents
        if(this.config.test)
        {
            this.addTestContents()
        }
    }

    setSocket()
    {
        // Create a channel for this specific chat
        this.chatSocket = this.config.socket.of('/project/' + this.slug + '/chat')

        // Callbacks
        this.socketCallbacks = {}
        this.socketCallbacks.connection = (socket) =>
        {
            // Create user
            const user = this.createUser()

            // Debug
            if(this.config.debug >= 1)
            {
                console.log(`${chalk.green.bold('chat > socket')} - ${chalk.cyan('connection')} - ${chalk.cyan(socket.id)}`)
                console.log(`${chalk.green.bold('chat > user')} - ${chalk.cyan('create')} - ${chalk.cyan(user.name)}`)
            }

            // Send user infos
            const broadcastUser = {}
            broadcastUser.name = user.name
            broadcastUser.color = user.color
            socket.emit('user', broadcastUser)


            const userSocketCallbacks = {}

            userSocketCallbacks.message = (data) =>
            {
                // Add ID and save
                data.id = ids.getId()
                data.time = new Date()
                this.messages.push(data)

                // Create a broadcast message, add complementary data and send
                const broadcastMessage = {}
                broadcastMessage.id = data.id
                broadcastMessage.time = data.time
                broadcastMessage.text = this.htmlEntities.encode(data.text)
                broadcastMessage.file = data.file
                broadcastMessage.version = data.version
                broadcastMessage.line = data.line
                broadcastMessage.user = user

                this.chatSocket.emit('message', broadcastMessage)

                // Debug
                if(this.config.debug >= 1)
                {
                    console.log(`${chalk.green.bold('chat > socket')} - ${chalk.cyan('message')} - ${chalk.cyan(user.name)} - ${chalk.cyan(data.text)}`)
                }
            }

            userSocketCallbacks.updateUser = (data) =>
            {
                const newName = data.name.trim()
                const oldName = user.name

                // Securities
                if(newName.length <= 0 || newName.length > 22 || newName === oldName)
                {
                    return
                }

                // Update name
                user.name = this.htmlEntities.encode(data.name)

                // Debug
                if(this.config.debug >= 1)
                {
                    console.log(`${chalk.green.bold('chat > socket')} - ${chalk.cyan('update_user')} - ${chalk.cyan(oldName + ' > ' + user.name)}`)
                }
            }

            userSocketCallbacks.alert = () =>
            {
                // Transfer to the watcher socket
                this.watcherSocket.emit('alert')

                // Debug
                if(this.config.debug >= 1)
                {
                    console.log(`${chalk.green.bold('chat > socket')} - ${chalk.cyan('alert')} - ${chalk.cyan(user.name)}`)
                }
            }

            userSocketCallbacks.disconnect = () =>
            {
                // Stop listening
                socket.off('message', userSocketCallbacks.message)
                socket.off('update_user', userSocketCallbacks.updateUser)
                socket.off('alert', userSocketCallbacks.alert)
                socket.off('disconnect', userSocketCallbacks.disconnect)

                console.log(`${chalk.green.bold('chat > socket')} - ${chalk.cyan('disconnect')} - ${chalk.cyan(user.name)}`)
            }

            // On message
            socket.on('message', userSocketCallbacks.message)
            socket.on('update_user', userSocketCallbacks.updateUser)
            socket.on('alert', userSocketCallbacks.alert)
            socket.on('disconnect', userSocketCallbacks.disconnect)
        }

        // Connection event
        this.chatSocket.on('connection', this.socketCallbacks.connection)
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
        const rgb = this.hslToRgb(Math.random(), 0.5, 0.5)

        rgb[0] = Math.round(rgb[0] * 0.7 + 255 * 0.3).toString(16)
        rgb[1] = Math.round(rgb[1] * 0.7 + 255 * 0.3).toString(16)
        rgb[2] = Math.round(rgb[2] * 0.7 + 255 * 0.3).toString(16)

        const color = `#${rgb[0]}${rgb[1]}${rgb[2]}`

        return color
    }

    hslToRgb(h, s, l)
    {
        let r
        let g
        let b

        if(s === 0)
        {
            r = g = b = l
        }
        else
        {
            const hue2rgb = function hue2rgb(_p, _q, _t)
            {
                let t = _t

                if(t < 0)
                {
                    t += 1
                }
                if(t > 1)
                {
                    t -= 1
                }
                if(t < 1 / 6)
                {
                    return _p + (_q - _p) * 6 * t
                }
                if(t < 1 / 2)
                {
                    return _q
                }
                if(t < 2 / 3)
                {
                    return _p + (_q - _p) * (2 / 3 - t) * 6
                }

                return _p
            }

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s
            const p = 2 * l - q

            r = hue2rgb(p, q, h + 1 / 3)
            g = hue2rgb(p, q, h)
            b = hue2rgb(p, q, h - 1 / 3)
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
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

    addTestContents()
    {
        // Create user A
        const userA = this.createUser()

        // Send user infos
        const broadcastUser = {}
        broadcastUser.name = userA.name
        broadcastUser.color = userA.color
        this.chatSocket.emit('user', broadcastUser)

        let counting = 0
        setInterval(() =>
        {
            const data = {}
            data.id = ids.getId()
            data.time = new Date()
            data.text = `message ${counting++}`
            data.file = null
            data.version = null
            data.line = null
            this.messages.push(data)

            // Create a broadcast message, add complementary data and send
            const broadcastMessage = {}
            broadcastMessage.id = data.id
            broadcastMessage.time = data.time
            broadcastMessage.text = this.htmlEntities.encode(data.text)
            broadcastMessage.file = data.file
            broadcastMessage.version = data.version
            broadcastMessage.line = data.line
            broadcastMessage.user = userA

            this.chatSocket.emit('message', broadcastMessage)
        }, 1500)
    }

    destructor()
    {
        // Stop listening
        this.chatSocket.off('connection', this.socketCallbacks.connection)
    }
}

module.exports = Chat
