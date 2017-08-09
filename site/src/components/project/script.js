import FilesTree from '@/components/files-tree'
import File from '@/components/file'

export default
{
    name: 'project',

    components:
    {
        FilesTree,
        File
    },

    computed:
    {
        project()
        {
            return this.$store.state.project
        },
        file()
        {
            return this.$store.state.file
        }
    },

    created()
    {
    },

    methods:
    {
    }
}