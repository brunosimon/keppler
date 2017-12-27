import Tooltip from '@/components/tooltip'

export default
{
    name: 'projects-hub',

    components:
    {
        Tooltip
    },

    computed:
    {
        serverConfig()
        {
            return this.$store.state.serverConfig
        },

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
            if(!this.currentProject)
            {
                return ''
            }

            return `${this.$store.state.serverConfig.domain}/${this.currentProject.slug}/download`
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