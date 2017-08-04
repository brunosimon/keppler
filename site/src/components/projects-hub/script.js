export default
{
    name: 'projects-hub',

    computed:
    {
        projects()
        {
            return this.$store.state.projects
        }
    },

    created()
    {

    }
}