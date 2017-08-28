import quotes from './quotes'

export default
{
    name: 'landing',

    computed:
    {
        quote: () => quotes[Math.floor(quotes.length * Math.random())],
        url: () => window.location.href
    }
}