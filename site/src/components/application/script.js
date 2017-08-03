import socketIoClient from 'socket.io-client'

export default
{
    name: 'application',

    data()
    {
        return {
            counter: 0,
            projects: { type: Object, value: {} }
        }
    },

    mounted()
    {
        const socketUrl = `${process.env.NODE_ENV === 'production' ? '' : 'http://localhost:1571'}/projects`
        const socket = socketIoClient(socketUrl)

        socket.on('connect', () =>
        {
            console.log('connected')
        })

        socket.on('update_projects', (data) =>
        {
            this.projects = data.all
        })

        window.setInterval(() =>
        {
            this.counter++
        }, 1000)
    }
}