import FilesTree from '@/components/files-tree'

export default
{
    name: 'project',

    components:
    {
        FilesTree
    },

    computed:
    {
        project()
        {
            return this.$store.state.project
        }
    },

    created()
    {
    },

    methods:
    {
    }
}