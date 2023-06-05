const mongoose = require("mongoose");
const Product = mongoose.model("Product");

module.exports.getAll = function (req, res) {
    let offset = parseInt(process.env.DEFAULT_OFFSET, 10);
    let count = parseInt(process.env.DEFAULT_COUNT, 10);
    let maxRecords = parseInt(process.env.MAX_RECORDS, 10);
    let response = {}
    if (req.query && req.query.offset) {
        offset = parseInt(req.query.offset, 10);
        if (isNaN(offset)) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_INVALID_PARAMETER_OFFSET;
            res.status(parseInt(process.env.RESPONSE_STATUS_INVALID_PARAMETER, 10)).json(response);
            return;
        }
    }
    if (req.query && req.query.count) {
        count = parseInt(req.query.count, 10);
        if (isNaN(offset)) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_INVALID_PARAMETER_COUNT;
            res.status(parseInt(process.env.RESPONSE_STATUS_INVALID_PARAMETER, 10)).json(response);
            return;
        }
        if (count > maxRecords) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_INVALID_PARAMETER_COUNT_EXCEED_LABEL;
            res.status(parseInt(process.env.RESPONSE_STATUS_INVALID_PARAMETER, 10)).json(response);
            return;
        }
    }

    const getAllProductsHandler = function (err, product) {
        if (err) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = err;
            console.log(err);
        } else {

            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_TRUE;
            response[process.env.RESPONSE_PARAMETER_DATA] = product;
        }
        //console.log(response)
        res.status(parseInt(process.env.RESPONSE_STATUS_OK, 10)).json(response);
    }
    Product.find({}, { reviews: false }).skip(offset).limit(count).exec(getAllProductsHandler);

}

module.exports.getOne = function (req, res) {
    const id = req.params.id;
    let response = {}
    const getOneProductHandler = function (err, product) {
        if (err) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_INTERNAL_ERROR_MESSAGE;
            res.status(parseInt(process.env.RESPONSE_STATUS_INTERNAL_ERROR, 10)).json(response);
            console.log(err);
        } else if (!product) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_NOT_FOUND_PRODUCT;
            res.status(parseInt(process.env.RESPONSE_STATUS_NOT_FOUND, 10)).json(response);
        } else {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_TRUE;
            response[process.env.RESPONSE_PARAMETER_DATA] = product;
            res.status(parseInt(process.env.RESPONSE_STATUS_OK, 10)).json(response);
        }
    }
    Product.findById(id).exec(getOneProductHandler);

}

module.exports.addOne = function (req, res) {
    let response = {}
    let params = req.body
    const addOneProductHandler = function (err, product) {
        if (err) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = err;
            res.status(parseInt(process.env.RESPONSE_STATUS_INTERNAL_ERROR, 10)).json(response);
            console.log(err);
        } else {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_TRUE;
            response[process.env.RESPONSE_PARAMETER_DATA] = product;
            res.status(parseInt(process.env.RESPONSE_STATUS_OK, 10)).json(response);
        }
    }
    const file = req.file
    params = { ...params, companyLogo: file?.filename }
    Product.create(params, addOneProductHandler);
}

const update = function (req, res, updateAction) {
    const id = req.params.id;
    let response = {}

    const saveOneProductHandler = function (err, product) {
        if (err) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = err;
            res.status(parseInt(process.env.RESPONSE_STATUS_INTERNAL_ERROR, 10)).json(response);
            console.log(err);
        } else {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_TRUE;
            response[process.env.RESPONSE_PARAMETER_DATA] = product;
            res.status(parseInt(process.env.RESPONSE_STATUS_OK, 10)).json(response);
        }
    }

    const getOneProductHandler = function (err, product) {
        if (err) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_INTERNAL_ERROR_MESSAGE;
            res.status(parseInt(process.env.RESPONSE_STATUS_INTERNAL_ERROR, 10)).json(response);
            console.log(err);
        } else if (!product) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_DATA] = process.env.RESPONSE_STATUS_NOT_FOUND_PRODUCT;
            res.status(parseInt(process.env.RESPONSE_STATUS_NOT_FOUND, 10)).json(response);
        } else {
            updateAction(product);
            product.save(saveOneProductHandler);
        }
    }
    Product.findById(id).exec(getOneProductHandler);
}

module.exports.fullUpdateOne = function (req, res) {
    const fullUpdateAction = function (product) {
        product.name = req.body.name;
        product.company = req.body.company;
        product.companyLogo = req.file?.filename;
        product.reviews = req.body.reviews;
    }
    update(req, res, fullUpdateAction);
}

module.exports.partialUpdateOne = function (req, res) {
    const partialUpdateAction = function (product) {
        if (req.body.name) {
            product.name = req.body.name;
        }
        if (req.body.company) {
            product.company = req.body.company;
        }
        if (req.file) {
            product.companyLogo = req.file?.filename;
        }
        if (req.body.reviews) {
            product.reviews = req.body.reviews;
        }
    }
    update(req, res, partialUpdateAction);
}

module.exports.deleteOne = function (req, res) {
    const id = req.params.id;
    let response = {}
    const deleteOneProductHandler = function (err, product) {
        if (err) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_INTERNAL_ERROR_MESSAGE;
            res.status(parseInt(process.env.RESPONSE_STATUS_INTERNAL_ERROR, 10)).json(response);
            console.log(err);
        } else if (!product) {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_FALSE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_NOT_FOUND_PRODUCT;
            res.status(parseInt(process.env.RESPONSE_STATUS_NOT_FOUND, 10)).json(response);
        } else {
            response[process.env.RESPONSE_PARAMETER_STATUS] = process.env.RESPONSE_PARAMETER_STATUS_TRUE;
            response[process.env.RESPONSE_PARAMETER_MESSAGE] = process.env.RESPONSE_STATUS_PRODUCT_DELETED;
            res.status(parseInt(process.env.RESPONSE_STATUS_OK, 10)).json(response);
        }
    }
    Product.findByIdAndDelete(id).exec(deleteOneProductHandler);

}