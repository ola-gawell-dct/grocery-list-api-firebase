'use strict';

const listDB = require('./database/list-db');
const itemService = require('./services/item-service');
const productsDB = require('./database/products-db');

const app = {};

const register = (action, callback) => {
    app[action] = callback;
}

register('lists.get', (parameters, context, response) => {

    return listDB.getLists()
        .then(lists => {
            return new Promise((res, rej) => {
                const listOfLists = lists.length > 0 ? lists.join(',') : 'inga';
                res({
                    speech: `Dina listor är ${listOfLists}`
                });
            });
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

register('lists.create', (parameters, context, response) => {

    const listName = parameters.listName;
    return listDB.createList(listName)
        .then(result => {
            return new Promise((res, rej) => {
                res({
                    speech: `Ok. Listan §{listName} är skapad.`
                });
            });
        })
        .catch(err => {
            console.log('Error creating list', err);
        });
});

const addItemIfProductExist = (product, item, listId) => {
    if (product) {
        return itemService.changeItem(listId, item, product.getUnit, product.getAmount);
    } else {
        return Object.assign({}, { name: item }, { missing: true });
    }
};

const createMissingProductsResponse = (missingProducts) => {
    return Promise.resolve({ 
        speech: `Vad är standardstorleken för ${missingProducts[0]}`,
        outputContexts: [{
            name: 'set_unit',
            parameters: {
                allMissing: missingProducts.slice(1),
                missingItem: missingProducts[0]
            },
            lifespan: 4
        }]
    });
}

const getListId = (listName) => {
    const DEFAULT_LIST_ID = 'v9zkyFGLw2qCjS4mKKoJ';

    if (!listName) {
        return Promise.resolve(DEFAULT_LIST_ID);
    }

    return listDB.findListByName(listName)
        .then(list => list.id);
}

register('items.add', (parameters, context, response) => {
    
    const listName = parameters.listName;
    const itemNames = parameters.item;
    return getListId(listName)
        .then(listId => {
            const allAddOps = []
            for (let item of itemNames) {
                const promise = productsDB.getProduct(item)
                    .then(product => addItemIfProductExist(product, item, listId));

                allAddOps.push(promise);
            }
            return Promise.all(allAddOps)
        })
        .then((result) => {
            const missing = result
                .filter(item => item && item.missing)
                .map(item => item.name);
                
            if (missing.length > 0) {
                return createMissingProductsResponse(missing);
            } else {
                return Promise.resolve({ 
                    speech: `Ok, la till ${itemNames}`
                });
            }
        });
});

register('products.create', (parameters, contexts, response) => {
    const currentContext = contexts.filter((ctx) => ctx.name === 'set_unit')[0];

    const item = currentContext.parameters.missingItem;
    const amount = parameters.amount;
    const unit = parameters.unit;
    const missingProducts = currentContext.parameters.allMissing;
    const itemNames = currentContext.parameters.item;

    return productsDB.createProduct(item, unit, amount)
        .then(() => getListId())
        .then((listId) => {
            console.log(listId);
            return itemService.changeItem(listId, item, unit, amount);
        })
        .then(() => {
            if (missingProducts.length > 0) {
                return createMissingProductsResponse(missingProducts);
            } else {
                return Promise.resolve({ 
                    speech: `Ok, varorna tillagda.`
                });
            }
        })

});

const route = (action, parameters, context, response) => {
    const callback = app[action];
    if (callback) {
        return callback(parameters, context, response)
    }
}

module.exports = {
    route
}