const express = require("express");

const routes = express.Router();
const productController = require("./controllers/product.controller");
const reviewsController = require("./controllers/reviews.controller");
const upload = require("./storage").upload;

routes.route(process.env.API_ALL_PRODUCT)
    .get(productController.getAll)
routes.post(process.env.API_ALL_PRODUCT,
    upload.single(process.env.PRODUCT_SCHEMA_FILE_FIELD_NAME),
    productController.addOne);


routes.route(process.env.API_ONE_PRODUCT)
    .get(productController.getOne)
    .delete(productController.deleteOne);

routes.put(process.env.API_ONE_PRODUCT,
    upload.single(process.env.PRODUCT_SCHEMA_FILE_FIELD_NAME),
    productController.fullUpdateOne);
routes.patch(process.env.API_ONE_PRODUCT,
    upload.single(process.env.PRODUCT_SCHEMA_FILE_FIELD_NAME),
    productController.partialUpdateOne);

routes.route(process.env.API_ALL_REVIEW_OF_PRODUCT)
    .get(reviewsController.getAll)
    .post(reviewsController.addOne);

routes.route(process.env.API_ONE_REVIEW_OF_PRODUCT)
    .get(reviewsController.getOne)
    .put(reviewsController.fullUpdateOne)
    .patch(reviewsController.partialUpdateOne)
    .delete(reviewsController.deleteOne);


module.exports = routes;
