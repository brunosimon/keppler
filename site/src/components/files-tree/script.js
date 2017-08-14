import FilesTreeFile from '@/components/files-tree-file'
import FilesTreeFolder from '@/components/files-tree-folder'

export default
{
    name: 'files-tree',

    components:
    {
        FilesTreeFile,
        FilesTreeFolder
    },

    computed:
    {
        files()
        {
            return this.$store.state.files.tree
        }
    }
}