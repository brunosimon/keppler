import socketIoClient from 'socket.io-client'

export default
{
    name: 'connexion',

    created()
    {
        this.url = `${process.env.NODE_ENV === 'production' ? '' : 'http://localhost:1571'}/projects`
        this.socket = socketIoClient(this.url)

        this.socket.on('connect', () =>
        {
            console.log('connected')
        })

        this.socket.on('update_projects', (data) =>
        {
            this.$store.commit('updateProjects', data.all)
        })
    }
}