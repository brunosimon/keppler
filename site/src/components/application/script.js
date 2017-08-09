import Connexion from '@/components/connexion'
import ProjectsHub from '@/components/projects-hub'
import Project from '@/components/project'

export default
{
    name: 'application',

    components:
    {
        Connexion,
        ProjectsHub,
        Project
    },

    data()
    {
        return {
            counter: 0
        }
    },

    computed:
    {
        projects()
        {
            return this.$store.state.projects
        },

        project()
        {
            return this.$store.state.project
        }
    },

    mounted()
    {
        window.setInterval(() =>
        {
            this.counter++
        }, 1000)
    }
}