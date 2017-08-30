import Vue from 'vue'
import VueHighlightJS from 'vue-highlightjs'

Vue.use(VueHighlightJS)

export default
{
    name: 'viewer',

    props:
    {
        differencesActive: { type: Boolean, default: true }
    },

    computed:
    {
        extension()
        {
            return this.$store.state.files.current.extension
        },

        version()
        {
            return this.$store.state.files.currentVersion
        },

        lines()
        {
            const lines = []
            const lineBreaks = (this.version.content.match(/\n/g) || []).length + 1

            // Create all lines
            for(let i = 0; i < lineBreaks; i++)
            {
                const line = {}
                line.index = lines.length + 1
                line.added = false
                line.removed = false

                lines.push(line)
            }

            // Loop through each diff and add line infos
            if(this.version.diff)
            {
                let lineProgress = 0

                // Added lines and unchanged lines
                for(const diffKey in this.version.diff)
                {
                    const diff = this.version.diff[diffKey]
                    let lineBreaks = (diff.value.match(/\n/g) || []).length

                    if(parseInt(diffKey) === this.version.diff.length - 1)
                    {
                        lineBreaks += 1
                    }

                    if(diff.added)
                    {
                        for(let i = 0; i < lineBreaks; i++)
                        {
                            const line = lines[lineProgress + i]
                            line.added = true
                        }
                    }

                    if(!diff.removed)
                    {
                        lineProgress += lineBreaks
                    }
                }

                lineProgress = 0

                // Removed lines
                for(const diffKey in this.version.diff)
                {
                    const diff = this.version.diff[diffKey]
                    let lineBreaks = (diff.value.match(/\n/g) || []).length

                    if(parseInt(diffKey) === this.version.diff.length - 1)
                    {
                        lineBreaks += 1
                    }

                    if(diff.removed)
                    {
                        const line = lines[lineProgress]
                        const nextLine = lines[lineProgress + 1]

                        if(!line.added && (!nextLine || nextLine.added === false))
                        {
                            line.removed = true
                        }
                    }

                    if(!diff.removed)
                    {
                        lineProgress += lineBreaks
                    }
                }
            }

            return lines
        }
    },

    methods:
    {
        onCodeKeyDown(event)
        {
            // Not arrow keys
            if(
                event.keyCode !== 38 &&
                event.keyCode !== 39 &&
                event.keyCode !== 30 &&
                event.keyCode !== 37
            )
            {
                // Not meta keys
                if(!event.metaKey && !event.ctrlKey)
                {
                    event.preventDefault()
                }

                // Meta keys
                else
                {
                    // Cut (meta + x) or past (meta + v) keys
                    if(event.keyCode === 88 || event.keyCode === 86)
                    {
                        event.preventDefault()
                    }
                }
            }
        }
    }
}