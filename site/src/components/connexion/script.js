import socketIoClient from 'socket.io-client'

export default
{
    name: 'connexion',

    computed:
    {
        project()
        {
            return this.$store.state.project
        }
    },

    watch:
    {
        project: 'onProjectChange'
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
            // console.log('update_projects', data)
            this.$store.commit('updateProjects', data.all)
        })
    },

    methods:
    {
        onProjectChange(value)
        {
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
            })
        }
    }
}