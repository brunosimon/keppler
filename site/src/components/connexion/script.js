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
        }
    },

    watch:
    {
        project: 'onProjectChange',
        pendingUser: 'onPendingUser',
        pendingMessage: 'onPendingMessage'
    },

    created()
    {
        const projectsUrl = `${process.env.NODE_ENV === 'production' ? '' : 'http://localhost:1571'}/projects`
        this.projectsSocket = socketIoClient(projectsUrl)

        this.projectsSocket.on('connect', () =>
        {
            // console.log('projects connected')
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

            // Project socket
            const projectURL = `${process.env.NODE_ENV === 'production' ? '' : 'http://localhost:1571'}/project/${value.slug}`

            this.projectSocket = socketIoClient(projectURL)

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

            // Chat socket
            const chatURL = `${process.env.NODE_ENV === 'production' ? '' : 'http://localhost:1571'}/project/${value.slug}/chat`

            this.chatSocket = socketIoClient(chatURL)

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
        }
    }
}