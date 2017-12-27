import FileIcon from '@/components/file-icon/'

export default
{
    name: 'files-tree-file',

    components:
    {
        FileIcon
    },

    props:
    {
        depth: { type: Number, default: 0 },
        content: { type: Object }
    },

    data()
    {
        return {
            matchingPositions: []
        }
    },

    computed:
    {
        visible()
        {
            let visible = true

            // Get and clean search
            const search = this.$store.state.files.search.replace(/ /g, '').toLowerCase()

            // If no search value, return true
            if(search !== '')
            {
                // Set up fuzzy search
                const text = this.content.path.full.replace(/^\.\//, '')
                let searchPosition = 0
                this.matchingPositions = []

                // Go through each character in the text
                for(let n = 0; n < text.length; n++)
                {
                    // If match a character in the search, highlight it
                    if(searchPosition < search.length && text[n].toLowerCase() === search[searchPosition])
                    {
                        searchPosition += 1
                        this.matchingPositions.push(n - this.content.path.directory.length + 1)
                    }
                }

                if(searchPosition !== search.length)
                {
                    visible = false
                }
            }

            return visible
        },

        currentFile()
        {
            return this.$store.state.files.currentFile
        }
    },

    methods:
    {
        onNameClick()
        {
            this.$store.commit('setFile', this.content.path.full)
            this.$store.commit('setLine', null)
        }
    }
}