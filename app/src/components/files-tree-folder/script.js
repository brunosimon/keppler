import FilesTreeFile from '@/components/files-tree-file'
import FileIcon from '@/components/file-icon/'

export default
{
    name: 'files-tree-folder',

    components:
    {
        FilesTreeFile,
        FileIcon
    },

    props:
    {
        depth: { type: Number, default: 0 },
        directory: { type: String, default: '' },
        content: { type: Object }
    },

    data()
    {
        return {
            open: true,
            matchingPositions: []
        }
    },

    computed:
    {
        fullPath()
        {
            return `${this.directory}${this.content.name}`
        },

        files()
        {
            const files = this.content.files.sort((fileA, fileB) => fileA.name < fileB.name ? -1 : 1)

            return files
        },

        visible()
        {
            let visible = false
            const totalCount = this.content.files.length
            let visibleCount = 0

            for(const $child of this.$children)
            {
                if($child.visible === true)
                {
                    visibleCount++
                }
            }

            if(visibleCount > 0)
            {
                visible = true
            }

            // Get and clean search
            const search = this.$store.state.files.search.replace(/ /g, '').toLowerCase()

            // If no search value, return true
            if(search !== '')
            {
                // Set up fuzzy search
                const text = this.fullPath.replace(/^\.\//, '')
                let searchPosition = 0
                this.matchingPositions = []

                // Go through each character in the text
                for(let n = 0; n < text.length; n++)
                {
                    // If match a character in the search, highlight it
                    if(searchPosition < search.length && text[n].toLowerCase() === search[searchPosition])
                    {
                        searchPosition += 1
                        this.matchingPositions.push(n - this.directory.length + 2)
                    }
                }
            }

            return visible
        }
    },

    methods:
    {
        onNameClick()
        {
            this.open = !this.open
        }
    }
}