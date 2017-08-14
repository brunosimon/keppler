export default
{
    name: 'chat',

    data()
    {
        return {
            userName: ''
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
        onUserNameChange()
        {
            this.$store.commit('askUpdateUser', { name: this.userName })
        },

        onUserNameKeyDown(event)
        {
            // Blur if enter pressed
            if(event.keyCode === 13)
            {
                event.target.blur()
            }
        }
    }
}