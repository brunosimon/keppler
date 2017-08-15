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

    computed:
    {
        visible()
        {
            // Get and clean search
            const search = this.$store.state.files.search.replace(/\ /g, '').toLowerCase()

            // If no search value, return true
            if(search === '')
            {
                return true
            }

            // Set up fuzzy search
            const text = this.content.data.path.full
            let searchPosition = 0

            // Go through each character in the text
            for(let n = 0; n < text.length; n++)
            {
                // If match a character in the search, highlight it
                if(searchPosition < search.length && text[n].toLowerCase() === search[searchPosition])
                {
                    searchPosition += 1
                }
            }

            if(searchPosition !== search.length)
            {
                return false
            }

            return true
        }
    },

    methods:
    {
        onNameClick()
        {
            this.$store.commit('setFile', this.content.data.path.full)
        }
    }
}