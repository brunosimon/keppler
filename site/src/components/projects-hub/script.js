export default
{
    name: 'projects-hub',

    computed:
    {
        projects()
        {
            return this.$store.state.projects.all
        },

        currentProject()
        {
            return this.$store.state.projects.current
        },

        projectsCount()
        {
            const keys = Object.keys(this.projects)
            return keys.length
        },

        downloadUrl()
        {
            return `${this.$store.state.url}/${this.currentProject.slug}/download`
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