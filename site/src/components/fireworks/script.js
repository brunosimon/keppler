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
        running: { type: Boolean, default: true }
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
        this.start()
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

        start()
        {
            if(this.running)
            {
                this.addBlast()
            }
        },

        addBlast()
        {
            this.blasts.push(this.blastsIndex++)

            if(this.running)
            {
                window.setTimeout(() =>
                {
                    this.addBlast()
                }, 1000 + Math.random() * 3000)
            }
        },

        removeBlast(index)
        {
            const blast = this.blasts.indexOf(index)

            if(blast !== -1)
            {
                this.blasts.splice(blast, 1)
            }
        },

        onBlastEnd(index)
        {
            this.removeBlast(index)
        }
    }
}