const mongoose = require("mongoose");
const Product = mongoose.model("Product");

module.exports.getAll = function (req, res) {
    let offset = parseInt(process.env.DEFAULT_OFFSET, process.env.BASE);
    let count = parseInt(process.env.DEFAULT_COUNT, process.env.BASE);
    let maxRecords = parseInt(process.env.MAX_RECORDS, process.env.BASE);
    const productId = req.params.productId;
    let response = {}
    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, process.env.BASE);
        if (isNaN(offset)) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_INVALID_PARAMETER_OFFSET;
            res.status(parseInt(process.env.RESPONSE_STATUS_INVALID_PARAMETER, process.env.BASE)).json(response);
            return;
        }
    }
    if (req.query && req.query.count) {
        count = parseInt(req.query.count, process.env.BASE);
        if (isNaN(offset)) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_INVALID_PARAMETER_COUNT;
            res.status(parseInt(process.env.RESPONSE_STATUS_INVALID_PARAMETER, process.env.BASE)).json(response);
            return;
        }
        if (count > maxRecords) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_INVALID_PARAMETER_COUNT_EXCEED_LABEL;
            res.status(parseInt(process.env.RESPONSE_STATUS_INVALID_PARAMETER, process.env.BASE)).json(response);
            return;
        }
    }

    const getAllReviewsByProductHandler = function (err, product) {
        if (err) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_INTERNAL_ERROR_MESSAGE;
            res.status(parseInt(process.env.RESPONSE_STATUS_INTERNAL_ERROR, process.env.BASE)).json(response);
            console.log(err);
        } else if (!product) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_NOT_FOUND_PRODUCT;
            res.status(parseInt(process.env.RESPONSE_STATUS_NOT_FOUND, process.env.BASE)).json(response);
        } else {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_TRUE;
            response[process.env.RESPONSE_PARAMETER_DATA] = product.reviews.slice(offset, offset + count);
        res.status(parseInt(process.env.RESPONSE_STATUS_OK, process.env.BASE)).json(response);
        }
        //console.log(response)
    }
    Product.findById(productId).select("reviews").exec(getAllReviewsByProductHandler);

}

module.exports.getOne = function (req, res) {
    const id = req.params.id;
    const productId = req.params.productId;
    let response = {}
    const getOneReviewByPoductHandler = function (err, product) {
        if (err) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_INTERNAL_ERROR_MESSAGE;
            res.status(parseInt(process.env.RESPONSE_STATUS_INTERNAL_ERROR, process.env.BASE)).json(response);
            console.log(err);
        } else if (!product) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_NOT_FOUND_PRODUCT;
            res.status(parseInt(process.env.RESPONSE_STATUS_NOT_FOUND, process.env.BASE)).json(response);
        } else if (!product.reviews.id(id)) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_NOT_FOUND_PLAYER;
            res.status(parseInt(process.env.RESPONSE_STATUS_NOT_FOUND, process.env.BASE)).json(response);
        } else {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_TRUE;
            response[process.env.RESPONSE_PARAMETER_DATA] = product.reviews.id(id);
            res.status(parseInt(process.env.RESPONSE_STATUS_OK, process.env.BASE)).json(response);
        }
    }
    Product.findById(productId).exec(getOneReviewByPoductHandler);

}

module.exports.deleteOne = function (req, res) {
    const id = req.params.id;
    const productId = req.params.productId;
    let response = {}

    const saveOneProductAfterReviewDeletedHandler = function (err, product) {
        if (err) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = err;
            res.status(parseInt(process.env.RESPONSE_STATUS_INTERNAL_ERROR, process.env.BASE)).json(response);
            console.log(err);
        } else {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_TRUE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_PLAYER_DELETED;
            res.status(parseInt(process.env.RESPONSE_STATUS_OK, process.env.BASE)).json(response);
        }
    }
    const getOneReviewAndDeleteItByProductHandler = function (err, product) {
        if (err) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_INTERNAL_ERROR_MESSAGE;
            res.status(parseInt(process.env.RESPONSE_STATUS_INTERNAL_ERROR, process.env.BASE)).json(response);
            console.log(err);
        } else if (!product) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_NOT_FOUND_PRODUCT;
            res.status(parseInt(process.env.RESPONSE_STATUS_NOT_FOUND, process.env.BASE)).json(response);
        } else if (!product.reviews.id(id)) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_NOT_FOUND_PLAYER;
            res.status(parseInt(process.env.RESPONSE_STATUS_NOT_FOUND, process.env.BASE)).json(response);
        } else {
            product.reviews.remove(id);
            product.save(saveOneProductAfterReviewDeletedHandler);
        }
    }
    Product.findById(productId).exec(getOneReviewAndDeleteItByProductHandler);
}

module.exports.addOne = function (req, res) {
    const id = req.params.id;
    const productId = req.params.productId;
    let response = {}
    let params = req.body
    const saveOneProductAfterReviewAddedHandler = function (err, product) {
        if (err) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = err;
            res.status(parseInt(process.env.RESPONSE_STATUS_INTERNAL_ERROR, process.env.BASE)).json(response);
            console.log(err);
        } else {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_TRUE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_REVIEW_ADDED;
            res.status(parseInt(process.env.RESPONSE_STATUS_OK, process.env.BASE)).json(response);
        }
    }

    const getOneProductAndAddReviewHandler = function (err, product) {
        if (err) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_INTERNAL_ERROR_MESSAGE;
            res.status(parseInt(process.env.RESPONSE_STATUS_INTERNAL_ERROR, process.env.BASE)).json(response);
            console.log(err);
        } else if (!product) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_NOT_FOUND_PRODUCT;
            res.status(parseInt(process.env.RESPONSE_STATUS_NOT_FOUND, process.env.BASE)).json(response);
        } else {
            product.reviews.push(params);
            product.save(saveOneProductAfterReviewAddedHandler);
        }
    }
    Product.findById(productId).exec(getOneProductAndAddReviewHandler);
}

const update = module.exports.fullUpdateOne = function (req, res, updateAction) {
    const id = req.params.id;
    const productId = req.params.productId;
    let response = {}

    const saveOneProductHandler = function (err, product) {
        if (err) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = err;
            res.status(parseInt(process.env.RESPONSE_STATUS_INTERNAL_ERROR, process.env.BASE)).json(response);
            console.log(err);
        } else {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_TRUE;
            response[process.env.RESPONSE_PARAMETER_DATA] = product.reviews.id(id);
            res.status(parseInt(process.env.RESPONSE_STATUS_OK, process.env.BASE)).json(response);
        }
    }

    const getOneReviewByProductHandler = function (err, product) {
        if (err) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_INTERNAL_ERROR_MESSAGE;
            res.status(parseInt(process.env.RESPONSE_STATUS_INTERNAL_ERROR, process.env.BASE)).json(response);
            console.log(err);
        } else if (!product) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_NOT_FOUND_PRODUCT;
            res.status(parseInt(process.env.RESPONSE_STATUS_NOT_FOUND, process.env.BASE)).json(response);
        } else if (!product.reviews.id(id)) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_NOT_FOUND_REVIEW;
            res.status(parseInt(process.env.RESPONSE_STATUS_NOT_FOUND, process.env.BASE)).json(response);
        } else {
            updateAction(product);
            product.save(saveOneProductHandler);
        }
    }
    Product.findById(productId).exec(getOneReviewByProductHandler);

}

module.exports.fullUpdateOne = function (req, res) {
    const id = req.params.id;
    const fullUpdateAction = function (product) {
        let reviews = product.reviews.id(id);
        reviews.name = req.body.name;
        reviews.title = req.body.title;
    }
    update(req, res, fullUpdateAction);
}

module.exports.partialUpdateOne = function (req, res) {
    const id = req.params.id;
    const fullUpdateAction = function (product) {
        let reviews = product.reviews.id(id);
        if (req.body.name) {
            reviews.name = req.body.name;
        }
        if (req.body.title) {
            reviews.title = req.body.title;
        }
    }
    update(req, res, fullUpdateAction);
}