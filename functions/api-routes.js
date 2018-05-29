'use strict';

const listDB = require('./database/list-db');
const itemDB = require('./database/item-db');
const itemService = require('./services/item-service');


const BASE_PATH = '/api/1'

const path = subPath => `${BASE_PATH}${subPath}`;

const register = (app) => {

    app.get(path('/lists'), (req, res) => {
        return listDB.getLists()
            .then(lists => {
                res.json({ lists });
            })
            .catch(err => {
                res.status(400).end('Could not get lists from firestore, ' + err);
            });
    });

    app.get(path('/lists/:listId/items'), (req, res) => {
        const listId = req.params.listId
        return itemDB.findAllByList(listId)
            .then(items => {
                res.json({ items });
            })
            .catch(err => {
                res.status(400).end('Could not get items from firestore, ' + err);
            });
    });

    app.post(path('/lists'), (req, res) => {

        const listName = req.body.name;
        return listDB.createList(listName)
            .then(result => {
                res.json({ id: listName });
            })
            .catch(err => {
                res.status(400).end('Could not create list in firestore, ' + err);
            });
    });

    app.post(path('/lists/:listId/items/:itemName'), (req, res) => {

        const listId = req.params.listId
  	    const itemName = req.params.itemName
  	    const amount = req.body.amount
        const unit = req.body.unit
      
        return itemService.changeItem(listId, itemName, unit, amount)
  	        .then((item) => res.json({ item }))
  	        .catch((err) => res.status(400).json({err}) )
    });
}




module.exports = {
    register
}