export default
{
    name: 'projects-hub',

    computed:
    {
        projects()
        {
            return this.$store.state.projects.all
        }
    },

    created()
    {

    },

    methods:
    {
        onProjectClick(projectSlug)
        {
            this.$store.commit('setProject', projectSlug)
        }
    }
}