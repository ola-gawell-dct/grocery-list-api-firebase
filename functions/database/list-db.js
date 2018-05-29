'use strict';

const functions = require('firebase-functions');
const firebase = require('firebase-admin');

const getLists = () => {
    return firebase.firestore().collection('lists').get()
        .then(snapshot => {
            const lists = [];
            snapshot.forEach((doc) => {
                lists.push({ id: doc.id, name: doc.data().name });
            })
            console.log(lists);
            return new Promise((res, rej) => res(lists));
        });
};

const createList = (name) => {
    return firebase.firestore().collection('lists').add({
        name: name
    })
};

const findListByName = (name) => {
    return firebase.firestore().collection('lists')
        .where('name', '==', name)
        .get()
        .then(snapshot => {
            if (snapshot.empty) {
                return Promise.resolve(null);
            }
            const doc = snapshot.docs[0];
            const list = Object.assign(doc.data(), { id: doc.id });
            return Promise.resolve(list);
        });
}

module.exports = {
    getLists,
    createList,
    findListByName
}