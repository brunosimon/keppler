<template>
    <div>
        {{ counter }}
    </div>
</template>

<script>
    import socketIoClient from 'socket.io-client'
    console.log(socketIoClient)

    export default
    {
        name: 'hello',

        data()
        {
            return {
                counter: 0
            }
        },

        mounted()
        {
            const socketUrl = `${process.env === 'production' ? '' : 'http://192.168.1.12:1571/projects'}`
            const socket = socketIoClient(socketUrl)

            socket.on('connect', () =>
            {
                console.log('connected')
            })

            window.setInterval(() =>
            {
                this.counter++
            }, 1000)
        }
    }
</script>

<style scoped>

</style>
