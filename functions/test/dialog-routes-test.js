'use strict';

const chai = require('chai');
const sinon = require('sinon');
const productsDB = require('../database/products-db');
const itemDB = require('../database/item-db');
const dialogRouter = require('../dialog-routes');

const { expect } = chai;

const items = [
    { name: 'mjölk', amount: 1, unit: 'l' }
];

const products = {
    ost: { name: 'ost', amount: 2, unit: 'kg' }
};

describe('Dialog Routes test', () => {

    let sandbox = null;

    before('create sinon sandbox', () => {
        sandbox = sinon.sandbox.create();
        sandbox.stub(productsDB, 'getProduct')
            .callsFake(name => Promise.resolve(products[name]));
        sandbox.stub(productsDB, 'createProduct')
            .callsFake(() => Promise.resolve());
        sandbox.stub(itemDB, 'findByNameAndUnit')
            .callsFake((name, unit) => {
                const matching = items.filter(item => item.name === name && item.unit === unit);
                return Promise.resolve(matching.length > 0 ? matching[0] : null);
            });
        sandbox.stub(itemDB, 'addItem')
            .callsFake(() => Promise.resolve());
    });

    after('restore sinon sandbox', () => {
        sandbox.restore();
    });

    it('Set unit for new product', (done) => {
        
        dialogRouter.route('products.create', { amount: 2, unit: 'l' }, [{
            name: 'set_unit',
            parameters: {
                missingItem: 'mjölk',
                allMissing: [],
                item: 'mjölk'
            }
        }])
            .then((result) => {
                console.log(result);
                done();
            })
            .catch(done);
    });

    it('Add item with existing product', (done) => {
        
        dialogRouter.route('items.add', { item: ['ost'] }, [])
            .then((result) => {
                console.log(result);
                done();
            })
            .catch(done);
    });

    it('Add item with non existing product', (done) => {
        
        dialogRouter.route('items.add', { item: ['mjölk'] }, [])
            .then((result) => {
                console.log(result);
                done();
            })
            .catch(done);
    });
});
