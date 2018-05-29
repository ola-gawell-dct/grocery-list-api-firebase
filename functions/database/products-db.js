'use strict';

const functions = require('firebase-functions');
const firebase = require('firebase-admin');

const assembleProduct = (doc) => {
    console.log("Assembling:");
    console.log(doc);
    return Object.assign({ id: doc.id},  doc.data());
}

const getProducts = () => {
    return firebase.firestore().collection('products').get()
        .then(snapshot => {
            const products = [];
            snapshot.forEach((doc) => {
                products.push(assembleProduct(doc));
            })
            console.log(products);
            return new Promise((res, rej) => res(products));
        });
};

const createProduct = (name, unit, amount) => {
    return firebase.firestore().collection('products').doc(name).set({
        unit,
        amount
    })
};

const getProduct = (name) => {
    return firebase.firestore().collection('products').doc(name)
        .get()
        .then(doc => {
            if (!doc.exists) {
                return Promise.resolve(null);
            }
            const product = assembleProduct(doc);
            console.log(product);
            return Promise.resolve(product);
        });
}

module.exports = {
    getProduct,
    getProducts,
    createProduct
}