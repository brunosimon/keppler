import Tooltip from '@/components/tooltip'

export default
{
    name: 'chat',

    components:
    {
        Tooltip
    },

    data()
    {
        return {
            userName: '',
            messageText: ''
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
        },

        scrollbarWidth()
        {
            return this.$store.state.scrollbarWidth
        },

        unreadCount()
        {
            return this.$store.state.chat.unreadCount
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
            window.requestAnimationFrame(() =>
            {
                if(this.atBottom)
                {
                    this.scrollToBottom()
                }
            })
        },

        open(value)
        {
            if(value)
            {
                window.requestAnimationFrame(() =>
                {
                    // Focus on textearea
                    this.$textarea.focus()
                })
            }
        },

        question(value)
        {
            if(value)
            {
                window.requestAnimationFrame(() =>
                {
                    // Focus on textearea
                    this.$textarea.focus()

                    // Scroll to bottom
                    this.scrollToBottom()
                })
            }
        }
    },

    created()
    {
        this.atBottom = true
    },

    mounted()
    {
        this.$messages = this.$el.querySelector('.messages')
        this.$textarea = this.$el.querySelector('.textarea')
        this.$innerMessages = this.$messages.querySelector('.inner-messages')
    },

    methods:
    {
        onHeaderClick()
        {
            this.$store.commit('toggleChat')
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
                // Focus on textearea
                this.$textarea.focus()
            }
        },

        onMessageTextKeyDown(event)
        {
            // Enter key pressed but without shift key
            if(event.keyCode === 13 && !event.shiftKey)
            {
                event.preventDefault()

                const text = this.messageText.trim()

                if(text)
                {
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

                    // Scroll to bottom
                    this.scrollToBottom()
                }
            }
        },

        onMessagesScroll()
        {
            this.atBottom = this.$messages.scrollTop + this.$messages.offsetHeight >= this.$innerMessages.offsetHeight - 15
        },

        onQuestionRemoveClick()
        {
            // Reset question
            this.$store.commit('setQuestion', null)

            // Focus on textearea
            this.$textarea.focus()
        },

        onFileClick(file, version, line)
        {
            // Set file, line and version
            this.$store.commit('setFile', file)
            this.$store.commit('setLine', line)

            window.requestAnimationFrame(() =>
            {
                this.$store.commit('setVersion', version)
            })

            // Focus on textearea
            this.$textarea.focus()

            // Scroll to bottom
            this.scrollToBottom()
        },

        scrollToBottom()
        {
            this.$messages.scrollTop = this.$innerMessages.offsetHeight - this.$messages.offsetHeight + 15
        },

        formatMinutes(time)
        {
            const date = new Date(time)

            let minutes = '' + date.getMinutes()
            if(minutes.length === 1)
            {
                minutes = `0${minutes}`
            }

            let hours = '' + date.getHours()
            if(hours.length === 1)
            {
                hours = `0${hours}`
            }

            return `${hours}:${minutes}`
        }
    }
}