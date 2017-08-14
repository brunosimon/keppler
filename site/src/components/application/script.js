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
            return this.$store.state.projects.all
        },

        project()
        {
            return this.$store.state.projects.current
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