export default
{
    name: 'blast',

    data()
    {
        return {
            sparks: [],
            color: 'yellow'
        }
    },

    created()
    {
        // Create sparks
        for(let i = 0; i < 25; i++)
        {
            this.sparks.push([
                Math.random() * 360 + 'deg',
                Math.random(),
                0.5 + Math.random() * 1.5 + 's'
            ])
        }

        // End timeout
        window.setTimeout(() =>
        {
            this.$emit('end', this.index)
        }, 4000)

        // Color
        this.color = `hsl(${255 * Math.random()}, 100%, 50%)`
    },

    mounted()
    {
    },

    methods:
    {
    }
}