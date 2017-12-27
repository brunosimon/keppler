export default
{
    name: 'blast',

    data()
    {
        return {
            sparks: [],
            cssColor: 'yellow'
        }
    },

    props:
    {
        color: { type: String, default: 'random' },
        sparksCount: { type: Number, default: 25 }
    },

    created()
    {
        // Create sparks
        for(let i = 0; i < this.sparksCount; i++)
        {
            this.sparks.push([
                Math.random() * 360 + 'deg', // Orientation
                Math.random(), // Scale
                0.5 + Math.random() * 1.5 + 's' // Duration
            ])
        }

        // End timeout
        window.setTimeout(() =>
        {
            this.$emit('end', this.index)
        }, 4000)

        // Random color
        if(this.color === 'random')
        {
            this.cssColor = `hsl(${255 * Math.random()}, 100%, 50%)`
        }
        // Specific color
        else
        {
            this.cssColor = this.color
        }
    }
}