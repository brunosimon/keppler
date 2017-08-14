import Connexion from '@/components/connexion'
import Projects from '@/components/projects'
import Project from '@/components/project'

export default
{
    name: 'application',

    components:
    {
        Connexion,
        Projects,
        Project
    },

    computed:
    {
        project()
        {
            return this.$store.state.projects.current
        }
    }
}