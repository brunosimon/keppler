'use strict'

class IDs
{
    constructor()
    {
        this.last_id = 0
    }

    get_id()
    {
        return ++this.last_id
    }
}

let ids = new IDs()

module.exports = ids
