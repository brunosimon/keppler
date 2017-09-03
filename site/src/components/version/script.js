import moment from 'moment'

export default
{
    name: 'version',

    props:
    {
        content: { type: Object }
    },

    data()
    {
        return {
            fromNow: ''
        }
    },

    computed:
    {
        isActive()
        {
            // No current version
            if(!this.$store.state.files.currentVersion)
            {
                return ''
            }

            return this.$store.state.files.currentVersion.date === this.content.date
        },

        date()
        {
            return this.moment.format('hh:mm')
        },

        modifiedLines()
        {
            let modifiedLines = this.content.addedLines.length + this.content.removedLines.length

            if(modifiedLines === 0)
            {
                modifiedLines = (this.content.content.match(/\n/g) || []).length + 1
            }

            return modifiedLines
        },

        repartition()
        {
            const repartition = {}
            repartition.added = 0
            repartition.removed = 0

            const modifiedLines = this.content.addedLines.length + this.content.removedLines.length

            // New file
            if(modifiedLines === 0)
            {
                const lineBreaks = (this.content.content.match(/\n/g) || []).length + 1

                repartition.added = lineBreaks < 10 ? lineBreaks : 10
                repartition.removed = 0
            }

            // Less than 10 modified lines
            else if(modifiedLines <= 10)
            {
                repartition.added = this.content.addedLines.length
                repartition.removed = this.content.removedLines.length
            }

            // More than 10 modified lines
            else
            {
                // Only added
                if(this.content.addedLines.length === modifiedLines)
                {
                    repartition.added = 10
                    repartition.removed = 0
                }

                // Only removed lines
                else if(this.content.removedLines.length === modifiedLines)
                {
                    repartition.added = 0
                    repartition.removed = 10
                }

                // else
                else
                {
                    let addedRatio = this.content.addedLines.length / modifiedLines
                    let removedRatio = this.content.removedLines.length / modifiedLines

                    if(addedRatio < 0.1)
                    {
                        addedRatio = 0.1
                        removedRatio = 0.9
                    }
                    else if(removedRatio < 0.1)
                    {
                        addedRatio = 0.9
                        removedRatio = 0.1
                    }

                    repartition.added = Math.round(addedRatio * 10)
                    repartition.removed = 10 - repartition.added
                }
            }

            return repartition
        }
    },

    created()
    {
        this.moment = moment(this.content.date)
        this.fromNow = this.moment.fromNow()

        this.fromNowInterval = window.setInterval(() =>
        {
            this.fromNow = this.moment.fromNow()
        }, 5000)
    },

    destroyed()
    {
        window.clearTimeout(this.fromNowInterval)
    }
}