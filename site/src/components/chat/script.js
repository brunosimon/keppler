export default
{
    name: 'chat',

    data()
    {
        return {
            userName: '',
            messageText: '',
            open: false
        }
    },

    computed:
    {
        messages()
        {
            return this.$store.state.chat.messages
        },

        user()
        {
            return this.$store.state.chat.user
        }
    },

    watch:
    {
        user(value)
        {
            this.userName = value.name
        }
    },

    mounted()
    {
    },

    methods:
    {
        onHeaderClick()
        {
            this.open = !this.open
        },

        onUserNameChange()
        {
            this.$store.commit('setPendingUser', { name: this.userName })
        },

        onUserNameKeyDown(event)
        {
            // Blur if enter pressed
            if(event.keyCode === 13)
            {
                event.target.blur()
            }
        },

        onMessageTextKeyDown(event)
        {
            // Blur if enter pressed
            if(event.keyCode === 13)
            {
                event.preventDefault()
                event.target.blur()

                this.$store.commit('setPendingMessage', { text: this.messageText })
                this.messageText = ''
            }
        }
    }
}