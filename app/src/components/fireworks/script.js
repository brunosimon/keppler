import Blast from '@/components/blast'

export default
{
    name: 'fireworks',

    components:
    {
        Blast
    },

    props:
    {
        running: { type: Boolean, default: true },
        minimumFrequency: { type: Number, default: 0.5 },
        randomFrequency: { type: Number, default: 2.5 },
        color: { type: String, default: 'random' },
        sparksCount: { type: Number, default: 30 }
    },

    data()
    {
        return {
            blasts: []
        }
    },

    watch:
    {
        running: 'onRunningChange'
    },

    created()
    {
        this.blastsIndex = 0
    },

    mounted()
    {
        // If running add first blast
        if(this.running)
        {
            this.addBlast()
        }
    },

    methods:
    {
        onRunningChange(value)
        {
            if(value)
            {
                this.addBlast()
            }
        },

        addBlast()
        {
            // Add blast to array
            this.blasts.push(this.blastsIndex++)

            // If still running wait and add another blast
            if(this.running)
            {
                const duration = (this.minimumFrequency * 1000) + Math.random() * (this.randomFrequency * 1000)
                window.setTimeout(() =>
                {
                    if(this.running)
                    {
                        this.addBlast()
                    }
                }, duration)
            }
        },

        onBlastEnd(index)
        {
            // Find blast index and remove properly from array
            const blast = this.blasts.indexOf(index)

            if(blast !== -1)
            {
                this.blasts.splice(blast, 1)
            }
        }
    }
}