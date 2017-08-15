class IDs
{
    constructor()
    {
        this.lastId = 0
    }

    getId()
    {
        const lastId = ++this.lastId

        return lastId
    }
}

const ids = new IDs()

module.exports = ids
