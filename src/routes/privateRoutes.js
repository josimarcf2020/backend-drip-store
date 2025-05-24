const express = require('express');
const productApiRoutes = require('./routes'); // Renamed for clarity, this will now be an Express Router

const privateRoutes = express.Router();

// Mount the product API routes.
// If privateRoutes is mounted at '/api' in server.js, paths will be like '/api/produtos'
// If privateRoutes is mounted at '/', paths will be like '/produtos'
privateRoutes.use(productApiRoutes);

privateRoutes.use((req, res, next) => {
    console.log('A request hit a private route.');
    next(); // Call next() to pass control to the next middleware or route handler
});

module.exports = privateRoutes;