'use strict';

const functions = require('firebase-functions');
const firebase = require('firebase-admin');

const findAllByList = (listId) => {
    return firebase.firestore().collection('items')
        .where('listId', '==', listId)
        .get()
        .then(snapshot => {
            const items = [];
            snapshot.forEach((doc) => {
                items.push(Object.assign(doc.data(), { id: doc.id }));
            })
            console.log(items);
            return new Promise((res, rej) => res(items));
        });
}

const findByNameAndUnit = (listId, itemName, unit) => {
    return firebase.firestore().collection('items')
        .where('listId', '==', listId)
        .where('name', '==', itemName)
        .where('unit', '==', unit)
        .get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log("Empty");
                return Promise.resolve(null);
            }
            const doc = snapshot.docs[0];
            const item = Object.assign(doc.data(), { id: doc.id });
            return Promise.resolve(item);
        });
}

const addItem = (listId, itemName, amount, unit) => {
    return firebase.firestore().collection('items').add({
        name: itemName, 
        listId, 
        amount, 
        unit, 
        checked: false
    });
}


const removeItem = (itemId) => {
    return firebase.firestore().collection('items').doc(itemId).delete();
}


const checkItem = (itemId) => {
    return firebase.firestore().collection('items').doc(itemId).set(
        { checked: true },
        { merge: true }
    );
}


const updateItem = (itemId, newAmaount) => {
    return firebase.firestore().collection('items').doc(itemId).set(
        { amount: newAmaount },
        { merge: true }
    );
}

/*
const removeAllChecked = (listId) => {
        Delete many: ({checked: true, list: listId})
}
*/

module.exports = {
    findAllByList,
    findByNameAndUnit,
    addItem,
    removeItem, 
    checkItem, 
    updateItem
}