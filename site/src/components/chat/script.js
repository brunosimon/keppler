export default
{
    name: 'chat',

    data()
    {
        return {
            userName: '',
            messageText: '',
            unreadCount: 0
        }
    },

    computed:
    {
        open()
        {
            return this.$store.state.chat.open
        },

        question()
        {
            return this.$store.state.chat.question
        },

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
            this.$store.commit('toggleChat')

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
            // Enter key pressed
            if(event.keyCode === 13)
            {
                event.preventDefault()

                const text = this.messageText.trim()

                if(text)
                {
                    // Blur
                    event.target.blur()

                    // Create and send message
                    const message = {}
                    message.text = text

                    if(this.question)
                    {
                        message.file = this.question.file
                        message.line = this.question.line
                        message.version = this.question.version
                    }

                    this.$store.commit('setPendingMessage', message)
                    this.messageText = ''

                    // Reset question
                    this.$store.commit('setQuestion', null)
                }
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
        },

        onQuestionRemoveClick()
        {
            this.$store.commit('setQuestion', null)
        },

        onFileClick(file, version, line)
        {
            this.$store.commit('setFile', file)
            this.$store.commit('setLine', line)

            window.requestAnimationFrame(() =>
            {
                this.$store.commit('setVersion', version)
            })
        }
    }
}