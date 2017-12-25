import socketIoClient from 'socket.io-client'

export default
{
    name: 'connexion',

    computed:
    {
        project()
        {
            return this.$store.state.projects.current
        },

        pendingUser()
        {
            return this.$store.state.chat.pendingUser
        },

        pendingMessage()
        {
            return this.$store.state.chat.pendingMessage
        },

        pendingAlert()
        {
            return this.$store.state.chat.pendingAlert
        }
    },

    watch:
    {
        project: 'onProjectChange',
        pendingUser: 'onPendingUser',
        pendingMessage: 'onPendingMessage',
        pendingAlert: 'onPendingAlert'
    },

    created()
    {
        const projectsUrl = `${process.env.NODE_ENV === 'production' ? '' : 'http://localhost:1571'}/projects`
        this.projectsSocket = socketIoClient(projectsUrl)

        this.projectsSocket.on('connect', (data) =>
        {
            // console.log('projects connected')
        })

        this.projectsSocket.on('config', (data) =>
        {
            this.$store.commit('updateServerConfig', data)
        })

        this.projectsSocket.on('update_projects', (data) =>
        {
            this.$store.commit('updateProjects', data.all)
        })
    },

    methods:
    {
        onProjectChange(value)
        {
            if(!value)
            {
                return
            }

            // Reset file
            this.$store.commit('setFile', null)

            // Reset messages
            this.$store.commit('emptyMessages', null)

            // If was connected to another socket
            if(this.projectSocket)
            {
                this.projectSocket.off('connect')
                this.projectSocket.off('update_project')
                this.projectSocket.off('create_file')
                this.projectSocket.off('delete_file')
                this.projectSocket.off('createVersion')
                this.projectSocket.disconnect()
            }

            // Create new socket connexion
            this.projectSocket = socketIoClient(`${process.env.NODE_ENV === 'production' ? '' : 'http://localhost:1571'}/project/${value.slug}`)

            this.projectSocket.on('connect', () =>
            {
                // console.log('project connected')
            })

            this.projectSocket.on('update_project', (data) =>
            {
                this.$store.commit('updateFiles', data.files.items)
            })

            this.projectSocket.on('create_file', (data) =>
            {
                this.$store.commit('createFile', data)
            })

            this.projectSocket.on('delete_file', (data) =>
            {
                this.$store.commit('deleteFile', data)
            })

            this.projectSocket.on('createVersion', (data) =>
            {
                this.$store.commit('createVersion', data)
            })

            // If was connected to another socket
            if(this.chatSocket)
            {
                this.chatSocket.off('connect')
                this.chatSocket.off('user')
                this.chatSocket.off('message')
                this.chatSocket.disconnect()
            }

            // Chat socket
            this.chatSocket = socketIoClient(`${process.env.NODE_ENV === 'production' ? '' : 'http://localhost:1571'}/project/${value.slug}/chat`)

            this.chatSocket.on('connect', () =>
            {
                // console.log('chat connected')
            })

            this.chatSocket.on('user', (data) =>
            {
                this.$store.commit('updateUser', data)
            })

            this.chatSocket.on('message', (data) =>
            {
                this.$store.commit('createMessage', data)
            })
        },

        onPendingUser(value)
        {
            if(value)
            {
                this.chatSocket.emit('update_user', value)
            }
        },

        onPendingMessage(value)
        {
            if(value)
            {
                this.chatSocket.emit('message', value)
            }
        },

        onPendingAlert(value)
        {
            if(value)
            {
                this.chatSocket.emit('alert')
            }
        }
    }
}