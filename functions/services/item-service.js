'use strict';

const itemDB = require('../database/item-db');

const changeItem = (listId, itemName, unit, amount) => {
    return itemDB.findByNameAndUnit(listId, itemName, unit)
        .then(item => upsertItem(item, listId, itemName, amount, unit));
}

const upsertItem = (item, listId, itemName, amount, unit) => {
    if (item == null) {
        return itemDB.addItem(listId, itemName, amount, unit)
    } else {
        if (item.checked) {
            itemDB.removeItem(item.id)
            return itemDB.addItem(listId, itemName, amount, unit);
        }

        const newAmaount = item.amount + amount
        if (newAmaount <= 0) {
            return itemDB.checkItem(item.id)
        } else {
            return itemDB.updateItem(item.id, newAmaount)
        }
    }
}

module.exports = {
    changeItem
}