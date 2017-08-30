import quotes from './quotes'

export default
{
    name: 'landing',

    computed:
    {
        quote: () => quotes[Math.floor(quotes.length * Math.random())],
        url()
        {
            return this.$store.state.url
        }
    }
}