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
        },

        scrollbarWidth()
        {
            return this.$store.state.scrollbarWidth
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
        },

        onAllReadClick()
        {
            // Go through each folder and file
            const eachFolder = (obj) =>
            {
                for(const folder of obj.folders)
                {
                    eachFolder(folder)
                }
                if(obj.files)
                {
                    for(const file of obj.files)
                    {
                        // Update changed and new properties
                        file.isChanged = false
                        file.isNew = false
                    }
                }
            }

            eachFolder(this.files)
        }
    }
}