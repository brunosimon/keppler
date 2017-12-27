export default
{
    name: 'illustration',

    props:
    {
        name: { type: String, default: '' }
    },

    data()
    {
        return {
            stars: []
        }
    },

    created()
    {
        for(let i = 0; i < 20; i++)
        {
            this.stars.push([
                Math.round(Math.random() * 200 - 50) + '%',
                Math.round(Math.random() * 200 - 50) + '%',
                Math.random() * 4 + 's'
            ])
        }
    }
}