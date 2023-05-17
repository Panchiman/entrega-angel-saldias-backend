import express from 'express';

import ProductManager from './classes/productManager.js';

const productManager = new ProductManager();

const app = express();

app.get('/products',async (req, res) => {
    const products = await productManager.getProducts(req.query.limit);
    res.send(products);
});

app.get('/products/:pid',async (req, res) => {
    const producto = await productManager.getProductById(req.params.pid);
    res.send(producto);
});

app.listen(8080, () => {console.log('Server started on port 8080')});