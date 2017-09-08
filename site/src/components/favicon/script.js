export default
{
    name: 'favicon',

    computed:
    {

        chatUnreadCount()
        {
            return this.$store.state.chat.unreadCount
        }
    },

    watch:
    {
        chatUnreadCount: 'onChatUnreadCountChange'
    },

    created()
    {
        this.$favicon = document.querySelector('.favicon')

        this.size = 16 * window.devicePixelRatio
        this.notifSize = 0.17

        this.canvas = document.createElement('canvas')
        this.canvas.width = this.size
        this.canvas.height = this.size

        this.context = this.canvas.getContext('2d')

        this.image = new Image()

        this.image.addEventListener('load', () =>
        {
            this.updateFavicon()
        })

        this.image.src = require('../../../static/images/favicon-32x32.png')
    },

    methods:
    {
        onChatUnreadCountChange()
        {
            this.updateFavicon()
        },

        updateFavicon()
        {
            // Clear
            this.context.clearRect(0, 0, this.size, this.size)

            // Draw image
            this.context.drawImage(this.image, 0, 0, this.size, this.size)

            // // Draw file notif
            // this.context.beginPath()
            // this.context.arc(this.size * (1 - this.notifSize), this.size * (1 - this.notifSize), this.size * this.notifSize, 0, Math.PI * 2)

            // this.context.fillStyle = '#9B52F5'
            // this.context.fill()

            // this.context.strokeStyle = '#360079'
            // this.context.stroke()

            // Draw chat notif
            if(this.chatUnreadCount > 0)
            {
                this.context.beginPath()
                this.context.arc(this.size * (1 - this.notifSize) - 1, this.size * (1 - this.notifSize) - 1, this.size * this.notifSize, 0, Math.PI * 2)
                // this.context.arc(this.size * (1 - this.notifSize * 2.25), this.size * (1 - this.notifSize), this.size * this.notifSize, 0, Math.PI * 2)

                this.context.fillStyle = '#4bd1c5' // ff763d
                this.context.fill()

                this.context.lineWidth = window.devicePixelRatio
                this.context.strokeStyle = '#0071ab' // ad1d3c
                this.context.stroke()
            }

            // Add to DOM
            this.$favicon.setAttribute('href', this.canvas.toDataURL())
        }
    }
}