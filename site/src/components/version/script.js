export default
{
    name: 'version',

    props:
    {
        content: { type: Object }
    },

    methods:
    {
        onClick()
        {
            this.$store.commit('setVersion', this.content)
        }
    }
}