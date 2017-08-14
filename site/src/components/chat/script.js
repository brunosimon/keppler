export default
{
    name: 'chat',

    data()
    {
        return {
            userName: '',
            messageText: '',
            open: false,
            unreadCount: 0
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
        },

        messages()
        {
            if(!this.atBottom || !this.open)
            {
                this.unreadCount++
            }

            window.requestAnimationFrame(() =>
            {
                if(this.atBottom)
                {
                    this.$messages.scrollTop = this.$innerMessages.offsetHeight - this.$messages.offsetHeight
                }
            })
        }
    },

    created()
    {
        this.atBottom = true
    },

    mounted()
    {
        this.$messages = this.$el.querySelector('.messages')
        this.$innerMessages = this.$messages.querySelector('.inner-messages')
    },

    methods:
    {
        onHeaderClick()
        {
            this.open = !this.open

            // Reset unread count
            if(this.open)
            {
                this.unreadCount = 0
            }
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
        },

        onMessagesScroll()
        {
            this.atBottom = this.$messages.scrollTop + this.$messages.offsetHeight >= this.$innerMessages.offsetHeight - 15

            // Reset unread count
            if(this.atBottom)
            {
                this.unreadCount = 0
            }
        }
    }
}