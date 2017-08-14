export default
{
    name: 'viewer',

    components:
    {
    },

    computed:
    {
        version()
        {
            return this.$store.state.files.currentVersion
        }
    }
}