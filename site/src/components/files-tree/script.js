import FilesTreeFile from '@/components/files-tree-file'
import FilesTreeFolder from '@/components/files-tree-folder'

export default
{
    name: 'files-tree',

    data()
    {
        return {
            searchValue: ''
        }
    },

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
    },

    watch:
    {
        searchValue: 'onSearchValueChange'
    },

    methods:
    {
        onSearchValueChange(value)
        {
            this.$store.commit('searchFile', value)
        }
    }
}